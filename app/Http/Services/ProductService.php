<?php

namespace App\Http\Services;

use App\Models\Product;

class ProductService
{

    public function browse()
    {
        $products = Product::query()->latest()->paginate(12);

        return $products;
    }
}