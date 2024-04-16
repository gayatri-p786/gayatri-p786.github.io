package com.example.stocksearchhw4;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.drawable.Drawable;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import it.xabaras.android.recyclerview.swipedecorator.RecyclerViewSwipeDecorator;

public class SwipeToDeleteHelper extends ItemTouchHelper.SimpleCallback {
    private SwipeToDeleteListener listener;
    private boolean isWatchlist;
//    private List<StockItem> itemList;
     // Define the delete icon here
//    private Context context;

    public interface SwipeToDeleteListener {
        void onSwipeToDelete(int position, boolean isWatchlist);
    }

    public SwipeToDeleteHelper(int dragDirs, int swipeDirs, SwipeToDeleteListener listener, boolean isWatchlist) {
        super(dragDirs, swipeDirs);
        this.listener = listener;
        this.isWatchlist=isWatchlist;
//        this.context = context;
    }

    @Override
    public boolean onMove(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, @NonNull RecyclerView.ViewHolder target) {
        return false;
    }

    @Override
    public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
        if (listener != null) {
            listener.onSwipeToDelete(viewHolder.getAdapterPosition(), isWatchlist);
        }
    }

    @Override
    public void onChildDraw(Canvas c, RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder, float dX, float dY, int actionState, boolean isCurrentlyActive) {
        super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);

        if (actionState == ItemTouchHelper.ACTION_STATE_SWIPE) {
            // Calculate the background color bounds
            int backgroundLeft = viewHolder.itemView.getRight() + (int) dX;
            int backgroundTop = viewHolder.itemView.getTop();
            int backgroundRight = viewHolder.itemView.getRight();
            int backgroundBottom = viewHolder.itemView.getBottom();

            // Set background color for swiped item
            Paint backgroundPaint = new Paint();
            backgroundPaint.setColor(ContextCompat.getColor(viewHolder.itemView.getContext(), R.color.red));
            c.drawRect(backgroundLeft, backgroundTop, backgroundRight, backgroundBottom, backgroundPaint);

            // Set delete icon for swiped item
            Drawable deleteIcon = ContextCompat.getDrawable(viewHolder.itemView.getContext(), R.drawable.delete);
            int deleteIconMargin = (viewHolder.itemView.getHeight() - deleteIcon.getIntrinsicHeight()) / 2;

            // Calculate the delete icon bounds
            int deleteIconTop = viewHolder.itemView.getTop() + (viewHolder.itemView.getHeight() - deleteIcon.getIntrinsicHeight()) / 2;
            int deleteIconBottom = deleteIconTop + deleteIcon.getIntrinsicHeight();
            int deleteIconLeft = viewHolder.itemView.getRight() - deleteIconMargin - deleteIcon.getIntrinsicWidth();
            int deleteIconRight = viewHolder.itemView.getRight() - deleteIconMargin;

            // Draw the delete icon
            deleteIcon.setBounds(deleteIconLeft, deleteIconTop, deleteIconRight, deleteIconBottom);
            deleteIcon.draw(c);
        }
    }

}
