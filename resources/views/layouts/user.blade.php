@extends('layouts.app_front')
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
        </main>
        <!-- /.site-main -->
    </div> 
    <!-- /.theme-customizer -->
    <!-- core plugins -->
@endsection