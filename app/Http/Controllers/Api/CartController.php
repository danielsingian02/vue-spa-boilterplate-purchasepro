<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartItemResource;
use App\Http\Responses\Response;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{

    public function browse(Request $request)
    {
        $user = $request->user();

        $items = CartItem::query()->with(['product'])->where('user_id', $user->getKey())->get();

        return Response::success($items)
            ->asResource(CartItemResource::class, true)
            ->toJsonResponse($request);
    }

    /**
     * Add product as cart items
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        // Get the authenticated user via Sanctum
        $user = $request->user();

        $productId = $request->input('product_id');
        $quantity = $request->input('quantity');

        $product = Product::find($productId);

        if ($product->stock < $quantity) {
            return $this->errorResponse('Product not available in the desired quantity', 400);
        }

        // Check if the product is already in the cart
        $cartItem = CartItem::where('user_id', $user->id)
                            ->where('product_id', $productId)
                            ->first();

        if ($cartItem) {
            // Update the quantity if it already exists
            $cartItem->increment('quantity', $quantity);
        } else {
            // Create a new cart item
            $cartItem = CartItem::make([
                'quantity' => $quantity,
            ]);

            $cartItem->user()->associate($user);
            $cartItem->product()->associate($product);
        }

        $cartItem->price = $product->price;

        if ($cartItem->save()) {
            return $this->successResponse([], 'Product added to cart successfully');
        }

        return $this->errorResponse('Unable to add product', 400);
    }

    public function delete(Request $request, CartItem $cartItem)
    {
        $user = $request->user();

        $cartItem = CartItem::where('id', $cartItem->getKey())
                            ->where('user_id', $user->id)
                            ->first();

        if (! $cartItem) {
            return $this->errorResponse('Item not found', 400);
        }

        $cartItem->delete();

        return $this->successResponse([], 'Item removed from cart');
    }
}
