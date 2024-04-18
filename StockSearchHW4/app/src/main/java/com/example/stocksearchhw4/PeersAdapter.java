package com.example.stocksearchhw4;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.text.Html;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class PeersAdapter extends RecyclerView.Adapter<PeersAdapter.ViewHolder> {

    private List<String> peersList;

    public PeersAdapter(List<String> peersList) {
        this.peersList = peersList;
        System.out.println("initialized"+peersList);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_peer, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        String symbol = peersList.get(position);
        holder.bind(symbol);
    }

    @Override
    public int getItemCount() {
        return peersList.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {

        private TextView symbolTextView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            symbolTextView = itemView.findViewById(R.id.symbolTextView);
            itemView.setOnClickListener(this);
        }

        public void bind(String symbol) {
            symbolTextView.setText(Html.fromHtml("<u>" + symbol + "</u>"));
        }

        @Override
        public void onClick(View v) {
            System.out.println("onclick"+peersList);
            // Get the clicked symbol
            String clickedSymbol = peersList.get(getAdapterPosition());
            // Store the symbol in SharedPreferences
            SharedPreferences sharedPreferences = v.getContext().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.putString("searchTicker", clickedSymbol);
            editor.apply();

            // Navigate to SearchDetailsActivity
            Intent intent = new Intent(v.getContext(), SearchDetailsActivity.class);
            v.getContext().startActivity(intent);
        }
    }
}
