use anchor_lang::prelude::*;
use crate::errors::Errors;

#[account]
pub struct CDP {
    pub debtor : Pubkey,
    pub debt_percent : u64, // in range of 140.00 to 160.00 (2 decimals)
    pub entry_price : u64, // 8 decimals 
    pub liquidation_price : u64, // 8 decimals
    pub amount : u64, // 2 decimals
    pub volume : u64,
    pub max_debt : u64,
    pub used_debt : u64,
    pub state : CDPState,
}

#[account]
pub struct SolPDA {}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;

impl CDP {

    pub fn init(&mut self, debtor : Pubkey, debt_percent : u64, entry_price : u64, amount : u64 ) -> Result<()> {

        let half_value: u64 = (amount * entry_price ) / 2_0000;
        let sur: u64 = (half_value * (debt_percent - 10000)) / 100_00;
        let col_value: u64 = half_value + sur;
        let max_debt: u64 = half_value - sur;
        let liq_value: u64 = half_value + ((half_value * 35 ) / 100);
        let liquidation_price: u64 = (liq_value * entry_price) / (col_value);

        self.debtor = debtor;
        self.debt_percent = debt_percent;
        self.entry_price = entry_price;
        self.liquidation_price = liquidation_price;
        self.amount = amount;
        self.volume = amount;
        self.max_debt = max_debt;
        self.used_debt = 0;
        self.state = CDPState::Active;

        Ok(())

    }

    pub const LEN : usize = DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH + 56 + 40;

    pub fn add_collateral(&mut self, new_entry_price : u64, new_amount : u64) -> Result<()> {

        self.entry_price = new_entry_price;

        self.amount = new_amount;

        self.calculate_figures(self.debt_percent, new_entry_price, new_amount, self.used_debt)?;

        Ok(())
    }

    pub fn remove_collateral(&mut self, new_amount : u64) -> Result<()> {

        self.amount = new_amount;

        self.calculate_figures(self.debt_percent, self.entry_price, new_amount, self.used_debt)?;

        Ok(())
    
    }

    pub fn issue_susd(&mut self, amount : u64) -> Result<()> {

        let new_used_debt: u64 = self.used_debt + amount;

        require!(new_used_debt < self.max_debt, Errors::MaxDebtError);

        self.used_debt = new_used_debt;

        self.calculate_figures(self.debt_percent, self.entry_price, self.amount, new_used_debt)?;

        Ok(())

    }

    pub fn repay_susd(&mut self, amount : u64) -> Result<()> {

        let new_used_debt: u64 = self.used_debt - amount;

        require!(new_used_debt > 0, Errors::NegativeDebtError);

        self.used_debt = new_used_debt;

        self.calculate_figures(self.debt_percent, self.entry_price, self.amount, new_used_debt)?;

        Ok(())

    }

    pub fn adjust_debt_percent(&mut self, new_debt_percent : u64) -> Result<()> {

        require!(new_debt_percent >= 14000 && new_debt_percent <= 16000, Errors::DebtPercentRangeError);

        self.debt_percent = new_debt_percent;

        self.calculate_figures(new_debt_percent, self.entry_price, self.amount, self.used_debt)?;

        Ok(())

    }

    pub fn close_position(&mut self) -> Result<()> {

        self.state = CDPState::Closed;

        Ok(())

    }

    pub fn liquidate_position(&mut self) -> Result<()> {

        self.state = CDPState::Liquidated;

        Ok(())
    }

    fn calculate_figures(&mut self, debt_percent : u64, entry_price : u64, amount : u64, used_debt : u64 ) -> Result<()> {

        let half_value: u64 = (amount * entry_price ) / 2_0000;
        let sur: u64 = (half_value * (debt_percent - 10000)) / 100_00;
        let col_value: u64 = half_value + sur;
        let max_debt: u64 = half_value - sur;
        let free_debt: u64 = max_debt - used_debt;
        let liq_value: u64 = half_value + ((half_value * 35 ) / 100);
        let liquidation_rate: u64 = (liq_value * entry_price) / (col_value + free_debt);

        require!(max_debt >= used_debt, Errors::MaxDebtError);

        self.liquidation_price = liquidation_rate;
        self.max_debt = max_debt;

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CDPState {
    Active,
    Closed,
    Liquidated,
}