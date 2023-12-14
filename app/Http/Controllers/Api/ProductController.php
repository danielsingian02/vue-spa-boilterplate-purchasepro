<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Services\ProductService;
use App\Models\Product;
use App\Http\Responses\Response;
use Illuminate\Http\Request;

class ProductController extends Controller
{
     /**
      * @var ProductService
      */
    private ProductService $service;

    /**
     * ProductController constructor.
     * 
     * @param ProductService $service
     */
    public function __construct(ProductService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function browse(Request $request)
    {
        $data = $this->service->browse();

        return Response::success($data)
            ->asResource(ProductResource::class, true)
            ->toJsonResponse($request);
    }

    /**
     * Display the specified resource.
     */
    public function read(Request $request, Product $product)
    {
        return Response::success($product)
            ->asResource(ProductResource::class)
            ->toJsonResponse($request);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
