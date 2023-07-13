use anchor_lang::prelude::*;

declare_id!("64kP5mUqZ7ZHu3qXzmGSKyF5eBpUocsGX3eYqgXtcqhr");

#[program]
pub mod s_usd {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
