@extends('layouts.app')
@section('head')
	<!-- <link rel="stylesheet" type="text/css" href="{{ url('') }}/assets/css/user/style.css"> -->
@endsection
@section('body') 
	@include('partials.web.navbar') 
    <!-- /.side-panel -->
    <div class="site-wrapper">
        @include('partials.web.header')
        <main class="site-main"> 
            @yield('content') 
            @include('partials.web.footer')
        </main>
        <!-- /.site-main -->
    </div> 
    <!-- /.theme-customizer -->
    <!-- core plugins -->
@endsection