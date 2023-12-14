<?php

namespace App\Models;

use App\Casts\MoneyCast;
use App\Models\Traits\Sluggable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    use Sluggable;

    const SLUGGABLE_COLUMN = 'slug';
    const SLUGGABLE_SOURCE = 'name';

    // mass assignable columns
    protected $fillable = [
        'name',
        'description',
        'excerpt',
        'price',
        'stock',
        'image',
        'status'
    ];

    // mass assignable columns
    protected $visible = [
        'name',
        'slug',
        'description',
        'excerpt',
        'price',
        'stock',
        'image',
        'status'
    ];

    /**
     * @var array
     */
    protected $casts = [
        'status' => 'boolean',
        'created_at' => 'datetime:Y-m-d\TH:i:sP',
        'updated_at' => 'datetime:Y-m-d\TH:i:sP',
        'price' => MoneyCast::class
    ];

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
