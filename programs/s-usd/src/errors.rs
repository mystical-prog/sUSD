use anchor_lang::error_code;

#[error_code]
pub enum Errors{

    #[msg("Used debt cannot exceed max debt")]
    MaxDebtError,

    #[msg("Debt percent range error")]
    DebtPercentRangeError
}