<?php
namespace App\Masks\Users;

use Crazy\Magic\MaskCollection;

class ProfileCollection extends MaskCollection
{
    /**
     * lấy tên class mask tương ứng
     *
     * @return string
     */
    public function getMask()
    {
        return ProfileMask::class;
    }
    // xem Collection mẫu ExampleCollection
}
