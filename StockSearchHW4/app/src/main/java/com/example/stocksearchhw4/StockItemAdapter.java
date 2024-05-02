package com.example.stocksearchhw4;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class StockItemAdapter extends RecyclerView.Adapter<StockItemAdapter.ViewHolder> {
    private List<StockItem> stockItems;
    private Context context;

    public StockItemAdapter(Context context, List<StockItem> stockItems) {
        this.stockItems = stockItems;
        this.context = context;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_stock, parent, false);
        return new ViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        StockItem stockItem = stockItems.get(position);
        // Bind stockItem data to views within the ViewHolder
        holder.symbolTextView.setText(stockItem.symbol);
        holder.companyNameTextView.setText(stockItem.companyName);
        // Set stock price
        String priceText = "$"+String.format("%.2f",stockItem.stockPrice);
        holder.priceTextView.setText(priceText);

        // Set stock change and direction (up or down)
        double priceChange = stockItem.stockChange;
        String priceChangeText = "$"+String.format("%.2f", priceChange) + "("+String.format("%.2f",stockItem.stockdp)+"%)";
        holder.priceChangeTextView.setText(priceChangeText);

        // Set arrow image based on condition
        if (priceChange > 0) {
            // Positive change: Show up arrow
            holder.arrowImageView.setImageResource(R.drawable.trending_up);
            holder.arrowImageView.setColorFilter(ContextCompat.getColor(context, R.color.green));
            holder.priceChangeTextView.setTextColor(ContextCompat.getColor(context, R.color.green));
        } else if (priceChange < 0) {
            // Negative change: Show down arrow
            holder.arrowImageView.setImageResource(R.drawable.trending_down);
            holder.arrowImageView.setColorFilter(ContextCompat.getColor(context, R.color.red));
            holder.priceChangeTextView.setTextColor(ContextCompat.getColor(context, R.color.red));
        } else {
            // No change: Hide the arrow and set text color to black
            holder.arrowImageView.setVisibility(View.GONE);
            holder.priceChangeTextView.setTextColor(ContextCompat.getColor(context, R.color.black));
        }
            holder.arrowImageButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    // Get the symbol of the corresponding item
                    String symbol = stockItem.symbol;

                    // Store the symbol in SharedPreferences
                    SharedPreferences sharedPreferences = context.getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = sharedPreferences.edit();
                    editor.putString("searchTicker", symbol);
                    editor.apply();

                    // Start a new activity (Replace YourActivity.class with your desired activity)
                    Intent intent = new Intent(context, SearchDetailsActivity.class);
                    context.startActivity(intent);
                }
            });

    }
    @Override
    public int getItemCount() {
        return stockItems.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView symbolTextView;
        TextView companyNameTextView;

        TextView priceTextView;
        TextView priceChangeTextView;

        ImageView arrowImageView;

        ImageButton arrowImageButton;

        ViewHolder(View itemView) {
            super(itemView);
            symbolTextView = itemView.findViewById(R.id.symbolTextView);
            companyNameTextView = itemView.findViewById(R.id.companyNameTextView);
            priceTextView = itemView.findViewById(R.id.priceTextView);
            priceChangeTextView = itemView.findViewById(R.id.priceChangeTextView);
            arrowImageView = itemView.findViewById(R.id.arrowImageView);
            arrowImageButton = itemView.findViewById(R.id.rightarrowbutton);
        }
    }
}
