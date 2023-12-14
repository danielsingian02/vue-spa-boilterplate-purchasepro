<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Mail\NewOrder;
use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class OrdersController extends Controller
{

    public function read(Request $request, Order $order)
    {
    }

    public function add(OrderRequest $request)
    {
        $inputs = $request->validated();

        $user = $request->user(); // Assuming you have the user available
        $cartItems = CartItem::where('user_id', $user->getKey())->get();

        $order = Order::make([
            'first_name' => $inputs['first_name'],
            'last_name' => $inputs['last_name'],
            'email' => $inputs['email'],
            'address_line_1' => $inputs['address']['address_line_1'],
            'city' => $inputs['address']['city'],
            'state' => $inputs['address']['state'],
            'zip' => $inputs['address']['zip'],
            'country' => $inputs['address']['country'],
        ]);

        // Start a transaction
        DB::transaction(function() use ($cartItems, $user, &$order) {
            $order->item_count = count($cartItems);
            $order->user()->associate($user);
            $order->save();

            foreach ($cartItems as $item) {
                $order->items()->attach($item->product->getKey(), [
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'name' => $item->product->name
                ]);

                // Step 2: Delete the item from the cart
                $item->delete();
            }
        });

        /**
         * TODO: Send notification
         */
        $order->load(['items']);

        Mail::to($user->email)->send(new NewOrder($order, $user));

        return $this->successResponse($order, 'Checkout completed successfully.');
    }
}
