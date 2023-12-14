<x-mail::message>
# Thank You for Your Order!

Hi {{ $customerName }},

We have received your order and are currently processing it. Thank you for shopping with us!

<x-mail::table>
| Product       | Quantity      | Price  |
| ------------- |:-------------:| ------:|
@foreach ($order->items as $item)
| {{ $item->pivot->name }} | {{ $item->pivot->quantity }} | ${{ $item->pivot->price }} |
@endforeach
</x-mail::table>

### Total Amount
${{ number_format($order->total_amount, 2) }}

<x-mail::panel>
### Shipping Address
{{ $order->address_line_1 }}<br>
{{ $order->city }}, {{ $order->state }} {{ $order->zip }}<br>
{{ $order->country }}
</x-mail::panel>



<x-mail::button :url="$url" color="success">
View Order
</x-mail::button>

Thanks again for choosing us. We hope you enjoy your purchase!

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
