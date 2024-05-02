package com.example.stocksearchhw4;


import android.graphics.Canvas;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.ViewCompat;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;

import java.util.Collections;
import java.util.List;

public class ItemReOrder extends ItemTouchHelper.Callback {

    private final RecyclerView.Adapter<?> adapter;
    private final List<?> dataset;


    public ItemReOrder(RecyclerView.Adapter<?> adapter, List<?> dataset) {
        this.adapter = adapter;
        this.dataset = dataset;
    }

    @Override
    public int getMovementFlags(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder) {
        int dragFlags = ItemTouchHelper.UP | ItemTouchHelper.DOWN;
        int swipeFlags = 0;
        return makeMovementFlags(dragFlags, swipeFlags);
    }

    @Override
    public boolean onMove(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, @NonNull RecyclerView.ViewHolder target) {
        // Prevent dragging items between sections
        if (viewHolder.getItemViewType() != target.getItemViewType()) {
            return false;
        }

        // Get the old and new positions
        int fromPosition = viewHolder.getAdapterPosition();
        int toPosition = target.getAdapterPosition();

        Collections.swap(dataset, fromPosition, toPosition);

//        adapter.notifyDataSetChanged();

        // Update the dataset and notify the adapter
        adapter.notifyItemMoved(fromPosition, toPosition);

        return true;
    }

//    @Override
//    public void onChildDraw(@NonNull Canvas c, @NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, float dX, float dY, int actionState, boolean isCurrentlyActive) {
//        super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);
//
//        if (actionState == ItemTouchHelper.ACTION_STATE_DRAG) {
//            // Set a consistent elevation for all item views
//            float elevation = 8f;
//            for (int i = 0; i < recyclerView.getChildCount(); i++) {
//                View itemView = recyclerView.getChildAt(i);
//                ViewCompat.setElevation(itemView, elevation);
//            }
//
//            // Get the dragged item
//            View draggedView = viewHolder.itemView;
//
//            // Adjust the elevation of other item views when dragged over them
//            for (int i = 0; i < recyclerView.getChildCount(); i++) {
//                View targetView = recyclerView.getChildAt(i);
//
//                // Skip the dragged item
//                if (targetView == draggedView) {
//                    continue;
//                }
//
//                // Determine if the dragged item is over this target view
//                if (dY > targetView.getTop() && dY < targetView.getBottom()) {
//                    // Reduce elevation to make the target view appear below the dragged item
//                    ViewCompat.setElevation(targetView, elevation - 1f);
//
//                    // Apply translation animation to move items above and below each other
//                    if (targetView.getTop() < draggedView.getTop()) {
//                        // Move target view below the dragged item
//                        targetView.animate().translationYBy(draggedView.getHeight()).setDuration(100).start();
//                    } else {
//                        // Move target view above the dragged item
//                        targetView.animate().translationYBy(-draggedView.getHeight()).setDuration(100).start();
//                    }
//                }
//            }
//        }
//    }
//

    @Override
    public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
        // Not used in drag and reorder functionality
    }

    @Override
    public boolean isLongPressDragEnabled() {
        return true;
    }

    @Override
    public boolean isItemViewSwipeEnabled() {
        return false;
    }

//    @Override
//    public void onSelectedChanged(@Nullable RecyclerView.ViewHolder viewHolder, int actionState) {
//        super.onSelectedChanged(viewHolder, actionState);
//        if (actionState == ItemTouchHelper.ACTION_STATE_DRAG) {
//            adapter.notifyItemMoved(viewHolder.getAdapterPosition(), viewHolder.getAdapterPosition());
//        }
//    }

}
