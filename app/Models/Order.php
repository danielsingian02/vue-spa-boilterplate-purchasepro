<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $table = "orders";

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'address_line_1',
        'city',
        'state',
        'zip',
        'country'
    ];

    protected $appends = [
        'total_amount'
    ];

    protected static function booted()
    {
        static::creating(function ($order) {
            $order->order_number = 'ORD - #' . time() . '-' . strtoupper(Str::random(5));
        });
    }

    /**
     * @return BelongsTo
     */
    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->belongsToMany(Product::class, 'order_items')
                    ->withPivot('quantity', 'price', 'discount', 'name')    
                    ->withTimestamps(); // if you have timestamps in the pivot table
    }

    public function getTotalAmountAttribute()
    {
        // Assuming each item has a 'price' and 'quantity' field
        return $this->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });
    }
}
