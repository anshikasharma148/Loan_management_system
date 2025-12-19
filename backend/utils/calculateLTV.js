const calculateLTV = (loanAmount, collateralValue) => {
  if (!collateralValue || collateralValue === 0) return 0;
  return (loanAmount / collateralValue) * 100;
};

const calculateCollateralValue = (mutualFunds) => {
  return mutualFunds.reduce((total, fund) => {
    return total + (fund.totalValue || 0);
  }, 0);
};

module.exports = { calculateLTV, calculateCollateralValue };

