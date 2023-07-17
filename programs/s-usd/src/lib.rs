use anchor_lang::prelude::*;
use anchor_lang::system_program;
use pyth_sdk_solana::load_price_feed_from_account_info;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use crate::state::cdp::*;
use crate::errors::Errors;
use std::str::FromStr;

pub mod state;
pub mod errors;
declare_id!("64kP5mUqZ7ZHu3qXzmGSKyF5eBpUocsGX3eYqgXtcqhr");
const SOLD_USD_PRICEFEED_ID : &str = "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix";

#[program]
pub mod s_usd {
    use super::*;

    pub fn create_cdp(ctx: Context<CreateCDP>, amount : u64, debt_percent : u64) -> Result<()> {
        
        if Pubkey::from_str(SOLD_USD_PRICEFEED_ID) != Ok(ctx.accounts.sol_usd_price_account.key()){
            return Err(error!(Errors::WrongPriceFeedId))
        };

        require!(debt_percent >= 14000 && debt_percent <= 16000, Errors::DebtPercentRangeError);

        require!(amount >= (LAMPORTS_PER_SOL / 100), Errors::SOLAmountError);

        let cdp : &mut Account<CDP> = &mut ctx.accounts.new_cdp;
        let signer : &Signer = &ctx.accounts.signer;
        let sol_usd_price_feed: pyth_sdk_solana::PriceFeed = load_price_feed_from_account_info(&ctx.accounts.sol_usd_price_account).unwrap();
        let current_timestamp = Clock::get()?.unix_timestamp;

        if let Some(current_price) = sol_usd_price_feed.get_price_no_older_than(current_timestamp, 60) {

            let cpi_context = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from : signer.to_account_info().clone(),
                    to : ctx.accounts.sol_pda.to_account_info().clone(),
                },
            );

            system_program::transfer(cpi_context, amount)?;

            cdp.init(signer.key(), debt_percent, current_price.price as u64, (amount * 100) / LAMPORTS_PER_SOL)?;
        } else {
            return Err(error!(Errors::PythPriceError))
        }

        Ok(())
    }

    pub fn add_collateral(ctx : Context<CollateralManagement>, amount : u64) -> Result<()> {

        if Pubkey::from_str(SOLD_USD_PRICEFEED_ID) != Ok(ctx.accounts.sol_usd_price_account.key()){
            return Err(error!(Errors::WrongPriceFeedId))
        };

        require!(amount >= (LAMPORTS_PER_SOL / 100), Errors::SOLAmountError);

        let cdp : &mut Account<CDP> = &mut ctx.accounts.cdp;
        require!(cdp.state == CDPState::Active, Errors::ActiveStateError);
        let signer : &Signer = &ctx.accounts.signer;
        require!(cdp.debtor == signer.key(), Errors::AuthorityError);
        let sol_usd_price_feed: pyth_sdk_solana::PriceFeed = load_price_feed_from_account_info(&ctx.accounts.sol_usd_price_account).unwrap();
        let current_timestamp = Clock::get()?.unix_timestamp;

        if let Some(current_price) = sol_usd_price_feed.get_price_no_older_than(current_timestamp, 60) {
            
            let new_amount: u64 = cdp.amount + ((amount * 100) / LAMPORTS_PER_SOL);
            let avg: u64 = ((cdp.amount * cdp.entry_price) + (((amount * 100) / LAMPORTS_PER_SOL) * (current_price.price as u64))) / new_amount;

            let cpi_context = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from : signer.to_account_info().clone(),
                    to : ctx.accounts.sol_pda.to_account_info().clone(),
                },
            );

            system_program::transfer(cpi_context, amount)?;

            cdp.volume = cdp.volume + amount;

            cdp.add_collateral(avg, new_amount)?;
            
        } else {
            return Err(error!(Errors::PythPriceError))
        }

        Ok(())
    }

    pub fn remove_collateral(ctx : Context<CollateralManagement>, amount : u64, bump : u8) -> Result<()> {

        require!(amount >= (LAMPORTS_PER_SOL / 100), Errors::SOLAmountError);

        let cdp : &mut Account<CDP> = &mut ctx.accounts.cdp;
        require!(cdp.state == CDPState::Active, Errors::ActiveStateError);
        let signer : &Signer = &ctx.accounts.signer;
        require!(cdp.debtor == signer.key(), Errors::AuthorityError);
        let seeds_bump = &[
            &signer.to_account_info().key.clone().to_bytes(),
            &[bump]
        ];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from : ctx.accounts.sol_pda.to_account_info().clone(),
                to : signer.to_account_info().clone(),
            },
            &seeds_bump
        );

        system_program::transfer(cpi_context, amount)?;
            
        let new_amount: u64 = cdp.amount - ((amount * 100) / LAMPORTS_PER_SOL);
        cdp.remove_collateral(new_amount)?;

        Ok(())
    }

    pub fn issue_susd(ctx : Context<SUSDManagement>, amount : u64) -> Result<()> {

        require!(amount > 0, Errors::ZeroAmountError);

        let cdp : &mut Account<CDP> = &mut ctx.accounts.cdp;
        require!(cdp.state == CDPState::Active, Errors::ActiveStateError);
        let signer : &Signer = &ctx.accounts.signer;
        require!(cdp.debtor == signer.key(), Errors::AuthorityError);

        cdp.issue_susd(amount)?;
        Ok(())

    }

    pub fn repay_susd(ctx : Context<SUSDManagement>, amount : u64) -> Result<()> {

        require!(amount > 0, Errors::ZeroAmountError);

        let cdp : &mut Account<CDP> = &mut ctx.accounts.cdp;
        require!(cdp.state == CDPState::Active, Errors::ActiveStateError);
        let signer : &Signer = &ctx.accounts.signer;
        require!(cdp.debtor == signer.key(), Errors::AuthorityError);

        cdp.repay_susd(amount)?;
        Ok(())

    }

    pub fn adjust_debt_percent(ctx : Context<SUSDManagement>, new_debt_percent : u64) -> Result<()> {

        let cdp : &mut Account<CDP> = &mut ctx.accounts.cdp;
        require!(cdp.state == CDPState::Active, Errors::ActiveStateError);
        let signer : &Signer = &ctx.accounts.signer;
        require!(cdp.debtor == signer.key(), Errors::AuthorityError);

        cdp.adjust_debt_percent(new_debt_percent)?;
        Ok(())

    }

    pub fn close_position(ctx : Context<SUSDManagement>) -> Result<()> {

        let cdp : &mut Account<CDP> = &mut ctx.accounts.cdp;
        require!(cdp.state == CDPState::Active, Errors::ActiveStateError);
        let signer : &Signer = &ctx.accounts.signer;
        require!(cdp.debtor == signer.key(), Errors::AuthorityError);

        cdp.close_position()?;
        Ok(())

    }

    pub fn liquidate_position(ctx : Context<LiquidateInstruction>) -> Result<()> {

        if Pubkey::from_str(SOLD_USD_PRICEFEED_ID) != Ok(ctx.accounts.sol_usd_price_account.key()){
            return Err(error!(Errors::WrongPriceFeedId))
        };

        let cdp : &mut Account<CDP> = &mut ctx.accounts.cdp;
        require!(cdp.state == CDPState::Active, Errors::ActiveStateError);
        let sol_usd_price_feed: pyth_sdk_solana::PriceFeed = load_price_feed_from_account_info(&ctx.accounts.sol_usd_price_account).unwrap();
        let current_timestamp = Clock::get()?.unix_timestamp;

        if let Some(current_price) = sol_usd_price_feed.get_price_no_older_than(current_timestamp, 60) {
            if (current_price.price as u64) < cdp.liquidation_price {
                cdp.liquidate_position()?;
            } else {
                return Err(error!(Errors::LiquidationError))
            }
        } else {
            return Err(error!(Errors::PythPriceError))
        }

        Ok(())
    }


}

#[derive(Accounts)]
pub struct CreateCDP<'info> {

    #[account(
        init,
        payer = signer,
        space = CDP::LEN,
    )]
    pub new_cdp : Account<'info, CDP>,

    #[account(
        init_if_needed,
        seeds = [&signer.to_account_info().key.clone().to_bytes()],
        bump,
        payer = signer,
        space = 8
    )]
    pub sol_pda : Account<'info, SolPDA>,

    #[account(mut)]
    pub signer : Signer<'info>,

    pub sol_usd_price_account : AccountInfo<'info>,

    pub system_program : Program<'info, System>

}

#[derive(Accounts)]
pub struct CollateralManagement<'info> {

    #[account(mut)]
    pub cdp : Account<'info, CDP>,

    #[account(mut)]
    pub signer : Signer<'info>,

    #[account(
        mut,
        seeds = [&signer.to_account_info().key.clone().to_bytes()],
        bump
    )]
    pub sol_pda : Account<'info, SolPDA>,

    pub sol_usd_price_account : AccountInfo<'info>,

    pub system_program : Program<'info, System>

}

#[derive(Accounts)]
pub struct SUSDManagement<'info> {

    #[account(mut)]
    pub cdp : Account<'info, CDP>,

    #[account(mut)]
    pub signer : Signer<'info>,

    pub system_program : Program<'info, System>

}

#[derive(Accounts)]
pub struct LiquidateInstruction<'info> {

    #[account(mut)]
    pub cdp : Account<'info, CDP>,

    #[account(mut)]
    pub signer : Signer<'info>,

    pub sol_usd_price_account : AccountInfo<'info>,

    pub system_program : Program<'info, System>
}