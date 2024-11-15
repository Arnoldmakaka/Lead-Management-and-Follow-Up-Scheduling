<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'id' => 1,
                'name' => 'User One',
                'email' => 'user@one.com',
                'email_verified_at' => now(),
                'role' => 'admin',
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(), 
            ],
            [
                'id' => 2,
                'name' => 'User Two',
                'email' => 'user@two.com',
                'email_verified_at' => now(),
                'role' => 'sales_manager',
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(), 
            ],
            [
                'id' => 3,
                'name' => 'User Three',
                'email' => 'user@three.com',
                'email_verified_at' => now(),
                'role' => 'sales_rep',
                'password' => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(), 
            ],
        ];

        User::insert($users);
    }
}
