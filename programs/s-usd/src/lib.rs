use anchor_lang::prelude::*;
use pyth_sdk_solana::load_price_feed_from_account_info;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;
use crate::state::cdp::*;
use crate::errors::Errors;

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

        require!(amount >= (LAMPORTS_PER_SOL / 100), Errors::SOLAmountError);

        let cdp : &mut Account<CDP> = &mut ctx.accounts.new_cdp;
        let signer : &Signer = &ctx.accounts.signer;
        let sol_usd_price_feed: pyth_sdk_solana::PriceFeed = load_price_feed_from_account_info(&ctx.accounts.sol_usd_price_account).unwrap();

        if let Some(current_price) = sol_usd_price_feed.get_current_price(){
            cdp = CDP::new(signer.key(), debt_percent, current_price, ((amount * 100) / LAMPORTS_PER_SOL))?;
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
        let sol_usd_price_feed: pyth_sdk_solana::PriceFeed = load_price_feed_from_account_info(&ctx.accounts.sol_usd_price_account).unwrap();

        if let Some(current_price) = sol_usd_price_feed.get_current_price(){
            
            let new_amount: u64 = cdp.amount + ((amount * 100) / LAMPORTS_PER_SOL);
            let avg: u64 = ((cdp.amount * cdp.entry_price) + (((amount * 100) / LAMPORTS_PER_SOL) * current_price)) / new_amount;
            cdp.add_collateral(avg, new_amount)?;
            
        } else {
            return Err(error!(Errors::PythPriceError))
        }

        Ok(())
    }

    pub fn remove_collateral(ctx : Context<CollateralManagement>, amount : u64) -> Result<()> {

        require!(amount > 0, Errors::ZeroAmountError);

        let cdp : &mut Account<CDP> = &mut ctx.accounts.cdp;
        require!(cdp.state == CDPState::Active, Errors::ActiveStateError);
        let signer : &Signer = &ctx.accounts.signer;
            
        let new_amount: u64 = cdp.amount - ((amount * 100) / LAMPORTS_PER_SOL);
        cdp.remove_collateral(new_amount)?;

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

    pub sol_usd_price_account : AccountInfo<'info>,

    pub system_program : Program<'info, System>

}

pub struct SUSDManagement<'info> {

    #[account(mut)]
    pub cdp : Account<'info, CDP>,

    #[account(mut)]
    pub signer : Signer<'info>,

    pub system_program : Program<'info, System>

}