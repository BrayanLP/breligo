@extends('layouts.app_front')
@section('head')
	<!-- <link rel="stylesheet" type="text/css" href="{{ url('') }}/assets/css/user/style.css"> -->
@endsection
@section('body')  
    <!-- /.side-panel -->
    <div class="site-wrapper"> 
        <main class="site-main"> 
            @yield('content')  
        </main>
        <!-- /.site-main -->
    </div> 
    <!-- /.theme-customizer -->
    <!-- core plugins -->
@endsection