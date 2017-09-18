<!DOCTYPE html>
<html lang="es">
<head>
   <meta charset="utf-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <!-- <meta name="viewport" content="width=device-width, initial-scale=1"> -->

   <title>
      @section('title')
      BRELIGO
      @show
   </title>

   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-status-barstyle" content="black-translucent">
   <link rel="apple-touch-icon" href="{{ url('') }}/assets/assets/images/logo.png">
   <meta name="apple-mobile-web-app-title" content="Gestor de Obras"> 
   <meta name="mobile-web-app-capable" content="yes"> 
   <link rel="stylesheet" href="{{url()}}/assets/app/css/admin/bootstrap/bootstrap.css">
   <link rel="stylesheet" href="{{url()}}/assets/app/css/admin/hamburgers/hamburgers.css">
   <link rel="stylesheet" href="{{url()}}/assets/app/css/admin/font-awesome/font-awesome.css">
   <link rel="stylesheet" href="{{url()}}/assets/app/css/admin/material-design-iconic-font/material-design-iconic-font.css">
   <link rel="stylesheet" href="{{url()}}/assets/app/css/admin/perfect-scrollbar/perfect-scrollbar.css">
   <link rel="stylesheet" href="{{url()}}/assets/app/css/admin/switchery/switchery.css">
   <!-- theme customizier -->
   <link rel="stylesheet" href="{{url()}}/assets/app/css/admin/theme-customizer/theme-customizer.css">
   <!-- site-wide styles -->
   <link rel="stylesheet" href="{{url()}}/assets/app/css/admin/style.css">
   <style>
      @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,600');
      @import url('https://fonts.googleapis.com/css?family=Raleway:300,400,500');
   </style>
   <script src="{{url()}}/assets/app/js/admin/breakpoints.js"></script>
   <script>
      Breakpoints(
      {xs: 
        {min:0,max:575},
        sm: {min:576,max:767},
        md: {min:768,max:991},
        lg: {min:992,max:1199},
        xl: {min:1200,max:Infinity}
      });
      // svg4everybody();
   </script>

  @yield('head') 

</head>
<body class="menubar-left menubar-inverse menubar-fold" 
@yield('body-tag')>
@yield('body')
<script>
  var base_url= "{{Config::get('app.api_server')}}";
  var url_host= "{{Config::get('app.url_host')}}"; 
  var baseUrl = "{{ url('') }}";
</script>  
<script src="{{url()}}/assets/app/js/admin/angular.js"></script>
<script src="{{url()}}/assets/app/js/admin/jquery.js"></script> 
<script src="{{url()}}/assets/app/js/admin/tether.js"></script>
<script src="{{url()}}/assets/app/js/admin/bootstrap.js"></script>
<script src="{{url()}}/assets/app/js/admin/jquery-slimscroll.js"></script>
<script src="{{url()}}/assets/app/js/admin/perfect-scrollbar.js"></script>
<script src="{{url()}}/assets/app/js/admin/switchery.js"></script>
<script src="{{url()}}/assets/app/js/admin/waypoints.js"></script>
<script src="{{url()}}/assets/app/js/admin/sticky.js"></script>
<script src="{{url()}}/assets/app/js/admin/counterup.js"></script>
<script src="{{url()}}/assets/app/js/admin/sparkline.js"></script>
<script src="{{url()}}/assets/app/js/admin/global.js"></script> 
<script src="{{url()}}/assets/app/js/admin/menu.js"></script>  
<!-- theme customizer -->
<script src="{{url()}}/assets/app/js/admin/theme-customizer.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.1/angular-sanitize.min.js"></script>
<script src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js"></script>
@yield('javascript')

</body>
</html>


