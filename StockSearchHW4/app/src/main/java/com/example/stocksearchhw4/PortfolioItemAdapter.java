package com.example.stocksearchhw4;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class PortfolioItemAdapter extends RecyclerView.Adapter<PortfolioItemAdapter.ViewHolder> {
    private List<PortfolioItem> portfolioItems;
    private Context context;

    public PortfolioItemAdapter(Context context, List<PortfolioItem> portfolioItems) {
        this.portfolioItems = portfolioItems;
        this.context = context;
    }



    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.portfolio_item, parent, false);
        return new ViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        PortfolioItem portfolioItem = portfolioItems.get(position);
        // Bind portfolioItem data to views within the ViewHolder
        holder.symbolTextView.setText(portfolioItem.getSymbol());
        holder.marketValueTextView.setText("$" + String.format("%.2f",portfolioItem.marketValue));
        // Set stock change and direction (up or down)
        double priceChange = portfolioItem.changeFromTotalCost;
        String priceChangeText = "$"+String.format("%.2f", priceChange) + "("+String.format("%.2f",portfolioItem.changeFromTotalCostPercentage)+"%)";
        holder.changeTextView.setText(priceChangeText);
        holder.totalSharesTextView.setText(String.format("%.2f",portfolioItem.getQuantity())+" shares");


        // Set arrow image based on condition
        if (priceChange > 0) {
            // Positive change: Show up arrow
            holder.arrowImageView.setImageResource(R.drawable.trending_up);
            holder.arrowImageView.setColorFilter(ContextCompat.getColor(context, R.color.green));
            holder.changeTextView.setTextColor(ContextCompat.getColor(context, R.color.green));
        } else if (priceChange < 0) {
            // Negative change: Show down arrow
            holder.arrowImageView.setImageResource(R.drawable.trending_down);
            holder.arrowImageView.setColorFilter(ContextCompat.getColor(context, R.color.red));
            holder.changeTextView.setTextColor(ContextCompat.getColor(context, R.color.red));
        } else {
            // No change: Hide the arrow and set text color to black
            holder.arrowImageView.setVisibility(View.GONE);
            holder.changeTextView.setTextColor(ContextCompat.getColor(context, R.color.black));
        }
//        String percent=""
//        holder.changeTextView.setText(portfolioItem.change);
//        holder.changePercentageTextView.setText("Change in Price Percentage: " + portfolioItem.changePercentage + "%");
//        holder.totalSharesTextView.setText("Total Shares Owned: " + portfolioItem.getQuantity());
    }

    @Override
    public int getItemCount() {
        return portfolioItems.size();
    }


    public PortfolioItem getItem(int position) {
        return portfolioItems.get(position);
    }


    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView symbolTextView;
        TextView marketValueTextView;
        TextView changeTextView;
        TextView totalSharesTextView;

        ImageView arrowImageView;

        ViewHolder(View itemView) {
            super(itemView);
            symbolTextView = itemView.findViewById(R.id.PortsymbolTextView);
            marketValueTextView = itemView.findViewById(R.id.PortpriceTextView);
            changeTextView = itemView.findViewById(R.id.PortpriceChangeTextView);
            totalSharesTextView = itemView.findViewById(R.id.TotalSharesTextView);
            arrowImageView = itemView.findViewById(R.id.PortarrowImageView);
        }
    }
}



