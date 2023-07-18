use anchor_lang::prelude::*;

#[account]
pub struct Listing {
    pub liquidator : Pubkey,
    pub debtor : Pubkey,
    pub sol_amount : u64,
    pub susd_amount : u64,
    pub state : ListingState,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;

impl Listing {

    pub const LEN : usize = DISCRIMINATOR_LENGTH + PUBLIC_KEY_LENGTH + PUBLIC_KEY_LENGTH + 8 + 8 + 24;

}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ListingState {
    Active,
    Sold,
}