use anchor_lang::error_code;

#[error_code]
pub enum Errors{

    #[msg("You do not own this position!")]
    AuthorityError,

    #[msg("Used debt cannot exceed max debt")]
    MaxDebtError,

    #[msg("Debt cannot be negative")]
    NegativeDebtError,

    #[msg("Debt percent range error")]
    DebtPercentRangeError,

    #[msg("Wrong price id has been sent in the instruction")]
    WrongPriceFeedId,

    #[msg("Pyth network didn't send the required price")]
    PythPriceError,

    #[msg("The amount cannot be zero")]
    ZeroAmountError,

    #[msg("The amount of SOL has to be larger than 0.099")]
    SOLAmountError,

    #[msg("You cannot interact with a position that is not active")]
    ActiveStateError,

    #[msg("Price is above the liquidation range for this position")]
    LiquidationError,
}