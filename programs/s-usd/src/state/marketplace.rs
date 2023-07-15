use anchor_lang::prelude::*;
use crate::errors::Errors;

#[account]
pub struct Listing {
    pub liquidator : Pubkey,
    pub debtor : Pubkey,
    pub sol_amount : u64,
    pub susd_amount : u64,
    pub state : ListingState,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ListingState {
    Active,
    Sold,
}