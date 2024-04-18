package com.example.stocksearchhw4;

public class PortfolioItem {
    String symbol;
    String company;
    double quantity;
    double total;
    double averageCostPerShare;

    double marketValue;
    double changeFromTotalCost;
    double changeFromTotalCostPercentage;

    public PortfolioItem(String symbol, String company, int quantity, double total, double averageCostPerShare, double marketValue, double changeFromTotalCost, double changeFromTotalCostPercentage) {
        this.symbol = symbol;
        this.company = company;
        this.quantity = quantity;
        this.total = total;
        this.averageCostPerShare = averageCostPerShare;
        this.marketValue=marketValue;
        this.changeFromTotalCost=changeFromTotalCost;
        this.changeFromTotalCostPercentage=changeFromTotalCostPercentage;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getCompany() {
        return company;
    }

    public double getQuantity() {
        return quantity;
    }

    public double getTotal() {
        return total;
    }

    public double getAverageCostPerShare() {
        return averageCostPerShare;
    }
}

