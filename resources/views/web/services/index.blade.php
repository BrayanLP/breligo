<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Breligo</title>
    <meta name="description" content="PlayKit is a premium adman dashboard template based on bootstrap">
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">
    <link rel="apple-touch-icon" href="apple-touch-icon.html">
    <!-- core plugins -->
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
    <!-- <script src="{{url()}}/assets/bower_components/breakpoints.js/dist/breakpoints.min.js"></script> -->
     
</head>

<body class="menubar-left menubar-inverse">
    <!--[if lt IE 10]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
  <![endif]-->
    <nav class="site-navbar navbar fixed-top navbar-toggleable-sm navbar-light bg-faded">
        <div class="navbar-header">
            <a class="navbar-brand" href="index-2.html">
                <svg class="flip-y" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32">
                    <path fill="currentColor" d="M30.063 2.585c-.253-1.023-.758-1.754-1.5-2.17-3.28-1.842-9.02 3.577-11.05 6.88-.65 1.06-1.275 2.358-1.792 3.718-1.486-.21-2.95-.098-4.366.337C6.954 12.694 4 16.975 4 22v2c0 4.337 3.663 8 8 8h1.98c5.31 0 9.803-3.664 10.682-8.714.33-1.89.142-3.807-.54-5.585 1.26-1.2 2.43-2.587 3.268-3.886 1.646-2.554 3.46-8.062 2.673-11.23zM12 23c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" />
                    <path data-color="color-2" fill="#52c03b" d="M10.77 9.437c1.14-.35 2.32-.527 3.506-.527h.148c.424-.954.888-1.846 1.37-2.633-1.106-2.466-2.56-4.72-4.01-5.71-.7-.477-1.387-.656-2.04-.528-.442.086-1.08.37-1.594 1.23C7 3.19 6.89 7.465 7.457 11.06c1-.7 2.108-1.255 3.312-1.623z" />
                </svg> <span class="brand-name hidden-fold">PlayKit</span> </a>
            <a href="javascript:void(0)" class="hidden-fold hidden-sm-down" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g transform="translate(.5 .5)" fill="none" stroke-linecap="square" stroke-miterlimit="10">
                        <path stroke="currentColor" d="M23 12c0-1.105-.895-2-2-2h-1.262c-.19-.732-.477-1.422-.852-2.058l.892-.892c.78-.78.78-2.047 0-2.828-.78-.78-2.047-.78-2.828 0l-.892.892c-.636-.375-1.326-.663-2.058-.852V3c0-1.104-.895-2-2-2s-2 .895-2 2v1.262c-.732.19-1.422.477-2.058.852l-.892-.892c-.78-.78-2.047-.78-2.828 0-.78.78-.78 2.047 0 2.828l.892.892C4.74 8.578 4.45 9.268 4.262 10H3c-1.104 0-2 .895-2 2s.895 2 2 2h1.262c.19.732.477 1.422.852 2.058l-.892.892c-.78.78-.78 2.047 0 2.828.78.78 2.047.78 2.828 0l.892-.892c.635.375 1.326.663 2.058.852V21c0 1.104.895 2 2 2s2-.895 2-2v-1.262c.732-.19 1.422-.477 2.058-.852l.892.892c.78.78 2.047.78 2.828 0 .78-.78.78-2.047 0-2.828l-.892-.892c.375-.635.663-1.326.852-2.058H21c1.104 0 2-.895 2-2z" />
                        <circle data-color="color-2" stroke="#52c03b" cx="12" cy="12" r="3" />
                    </g>
                </svg>
            </a>
            <button data-toggle="menubar" class="mr-auto hidden-md-up hamburger hamburger--collapse js-hamburger" type="button"><span class="hamburger-box"><span class="hamburger-inner"></span></span>
            </button>
            <button type="button" class="navbar-toggler hidden-md-up collapsed" data-toggle="navbar-search"><span class="sr-only">Toggle navigation</span> <span class="zmdi zmdi-hc-lg zmdi-search"></span></button>
            <button type="button" class="navbar-toggler hidden-md-up collapsed" data-toggle="collapse" data-target="#site-navbar-collapse" aria-expanded="false"><span class="sr-only">Toggle navigation</span> <span class="zmdi zmdi-hc-lg zmdi-more"></span></button>
        </div>
        <!-- /.navbar-header -->
        <div class="collapse navbar-collapse" id="site-navbar-collapse">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item hidden-sm-down">
                    <a class="nav-link" href="#">
                        <button data-toggle="menubar-fold" class="hamburger hamburger--arrowalt is-active js-hamburger" type="button"><span class="hamburger-box"><span class="hamburger-inner"></span></span>
                        </button>
                    </a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-linejoin="round">
                                <path data-color="color-2" stroke="currentColor" d="M15.5 20.5c0 1.7-1.3 3-3 3s-3-1.3-3-3" />
                                <path stroke="currentColor" d="M19.5 13.5v-5c0-3.9-3.1-7-7-7s-7 3.1-7 7v5c0 4-2 7-2 7h18s-2-3-2-7z" />
                            </g>
                        </svg> <span class="badge badge-circle badge-danger">4</span></a>
                    <div class="media-list dropdown-menu p-0" data-plugin="dropdownCaret">
                        <div class="dropdown-item dropdown-menu-cap d-flex"><span class="mr-auto my-1">You Have 4 Unread Notifications</span> <a href="#" class="btn btn-sm btn-secondary my-1">See all</a></div>
                        <div class="scroll-container"><a href="javascript:void(0)" class="media dropdown-item"><span class="avatar bg-success" data-plugin="firstLitter" data-target="#message-1"></span><div class="media-body"><h6 class="media-heading" id="message-1">Mohamed Ali</h6><small>Lorem ipsum dolor sit amet, Lorem ipsum dolor.</small></div></a><a href="javascript:void(0)" class="media dropdown-item"><span class="avatar bg-warning" data-plugin="firstLitter" data-target="#message-2"></span><div class="media-body"><h6 class="media-heading" id="message-2">Sophia Smith</h6><small>Lorem ipsum dolor sit amet, Lorem ipsum dolor.</small></div></a><a href="javascript:void(0)" class="media dropdown-item"><span class="avatar bg-primary" data-plugin="firstLitter" data-target="#message-3"></span><div class="media-body"><h6 class="media-heading" id="message-3">Sarah Adams</h6><small>Lorem ipsum dolor sit amet, Lorem ipsum dolor.</small></div></a><a href="javascript:void(0)" class="media dropdown-item"><span class="avatar bg-danger" data-plugin="firstLitter" data-target="#message-4"></span><div class="media-body"><h6 class="media-heading" id="message-4">John Doe</h6><small>Lorem ipsum dolor sit amet, Lorem ipsum dolor.</small></div></a></div>
                        <!-- /.scroll-container -->
                    </div>
                    <!-- /.media-list -->
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-linejoin="round">
                                <path data-color="color-2" stroke="currentColor" d="M19.5 7.5l-7 7-7-7" />
                                <path stroke="currentColor" d="M1.5 3.5h22v18h-22z" />
                                <path data-color="color-2" stroke="currentColor" d="M7.5 15.5l-2 2M17.5 15.5l2 2" />
                            </g>
                        </svg> <span class="badge badge-circle badge-success">3</span></a>
                    <div class="media-list dropdown-menu p-0" data-plugin="dropdownCaret">
                        <div class="dropdown-item dropdown-menu-cap d-flex"><span class="mr-auto my-1">You Have 3 Unread Messages</span> <a href="#" class="btn btn-sm btn-secondary my-1">See all</a></div>
                        <div class="scroll-container">
                            <a href="javascript:void(0)" class="media dropdown-item">
                                <div class="avatar"><img src="{{url()}}/assets/global/images/203.jpg" alt=""> <span class="badge badge-success">5</span></div>
                                <div class="media-body">
                                    <h6 class="media-heading">Ahmed Gamal</h6><small>Lorem ipsum dolor sit amet, Lorem ipsum dolor.</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media dropdown-item">
                                <div class="avatar"><img src="{{url()}}/assets/global/images/101.jpg" alt=""> <span class="badge badge-success">9</span></div>
                                <div class="media-body">
                                    <h6 class="media-heading">Nick Pettit</h6><small>Lorem ipsum dolor sit amet, Lorem ipsum dolor.</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media dropdown-item">
                                <div class="avatar"><img src="{{url()}}/assets/global/images/202.jpg" alt=""> <span class="badge badge-success">1</span></div>
                                <div class="media-body">
                                    <h6 class="media-heading">Media heading</h6><small>Lorem ipsum dolor sit amet, Lorem ipsum dolor.</small></div>
                            </a>
                        </div>
                        <!-- /.scroll-container -->
                    </div>
                    <!-- /.media-list -->
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img class="nav-img" src="{{url()}}/assets/global/images/flags/United-States-of-America.png" alt=""> <span class="nav-text hidden-sm-down ml-2">English</span> <i class="nav-caret hidden-sm-down zmdi zmdi-hc-sm zmdi-chevron-down"></i></a>
                    <div class="dropdown-menu p-0" data-plugin="dropdownCaret"><a class="dropdown-item dropdown-menu-cap">4 Languages</a>
                        <a class="dropdown-item" href="#"><img src="{{url()}}/assets/global/images/flags/Egypt.png" class="mr-2 dropdown-item-icon" alt=""> <span>Arabic</span> </a>
                        <a class="dropdown-item" href="#"><img src="{{url()}}/assets/global/images/flags/United-States-of-America.png" class="mr-2 dropdown-item-icon" alt=""> <span>English</span> </a>
                        <a class="dropdown-item" href="#"><img src="{{url()}}/assets/global/images/flags/Spain.png" class="mr-2 dropdown-item-icon" alt=""> <span>Spanish</span></a>
                    </div>
                </li>
                <li class="nav-item dropdown mega-dropdown"><a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="nav-text">Media</span> <i class="nav-caret zmdi zmdi-hc-sm zmdi-chevron-down"></i></a>
                    <div class="dropdown-menu mega-dropdown-menu p-0">
                        <div class="scroll-container">
                            <div class="mega-menu">
                                <div class="mega-menu-section">
                                    <h6 class="mb-3">Featured Courses</h6>
                                    <div class="mega-links-list"><a href="#">Bootstrap</a> <a href="#">SASS Basics</a> <a href="#">HTML &amp; CSS</a> <a href="#">PHP For Beginners</a> <a href="#">SASS Best Practices</a> <a href="#">Javascript Intermediate</a></div>
                                </div>
                                <!-- /.mega-menu-section -->
                                <div class="mega-menu-section">
                                    <div class="g__item mb-3">
                                        <figure class="g__figure">
                                            <a href="#"><img class="img-fluid" src="https://themes.tielabs.com/sahifa/wp-content/uploads/sites/3/2015/01/1806717289_6e97fe91c9_b-660x330.jpg" alt=""></a>
                                            <figcaption class="g__overlay"><i class="g__zoom fa fa-film fa-2x"></i></figcaption>
                                        </figure>
                                    </div>
                                    <h6>Featured Video</h6><span><i class="zmdi zmdi-time"></i> Jan 25, 2017</span></div>
                                <!-- /.mega-menu-section -->
                                <div class="mega-menu-section">
                                    <div class="mega-media-list">
                                        <div class="media mb-3">
                                            <div class="g__item mr-3 mb-0">
                                                <figure class="g__figure">
                                                    <a href="#"><img src="{{url()}}/assets/global/images/blog-img-11.jpg" alt=""></a>
                                                    <figcaption class="g__overlay"><i class="g__zoom fa fa-image fa-2x"></i></figcaption>
                                                </figure>
                                            </div>
                                            <div class="media-body">
                                                <h6 class="media-heading"><a href="#">Your Guide To PHP</a></h6><span>This is an excerpt</span> <span><i class="zmdi zmdi-time"></i> Apr 14, 2016</span></div>
                                        </div>
                                        <!-- /.media -->
                                        <div class="media mb-3">
                                            <div class="g__item mr-3 mb-0">
                                                <figure class="g__figure">
                                                    <a href="#"><img src="{{url()}}/assets/global/images/blog-img-12.jpg" alt=""></a>
                                                    <figcaption class="g__overlay"><i class="g__zoom fa fa-image fa-2x"></i></figcaption>
                                                </figure>
                                            </div>
                                            <div class="media-body">
                                                <h6 class="media-heading"><a href="#">Javascript Weird Parts</a></h6><span>This is an excerpt of the post</span> <span><i class="zmdi zmdi-time"></i> May 15, 2016</span></div>
                                        </div>
                                        <!-- /.media -->
                                        <div class="media">
                                            <div class="g__item mr-3 mb-0">
                                                <figure class="g__figure">
                                                    <a href="#"><img src="{{url()}}/assets/global/images/blog-img-13.jpg" alt=""></a>
                                                    <figcaption class="g__overlay"><i class="g__zoom fa fa-image fa-2x"></i></figcaption>
                                                </figure>
                                            </div>
                                            <div class="media-body">
                                                <h6 class="media-heading"><a href="#">Bootstrap 4 Is Here</a></h6><span>This is an excerpt of the post</span> <span><i class="zmdi zmdi-time"></i> Jan 25, 2016</span></div>
                                        </div>
                                        <!-- /.media -->
                                    </div>
                                    <!-- /.mega-media-list -->
                                </div>
                                <!-- /.mega-menu-section -->
                            </div>
                            <!-- /.mega-menu -->
                        </div>
                        <!-- /.scroll-container -->
                    </div>
                    <!-- /.dropdown-menu -->
                </li>
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item">
                    <div id="navbar-search" class="navbar-search">
                        <form class="form-inline navbar-search-form">
                            <input class="form-control navbar-search-field" type="text" placeholder="Search">
                            <button type="submit" class="navbar-search-submit">
                                <svg class="svg-search-icon">
                                    <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#search" />
                                </svg>
                            </button>
                            <button class="navbar-search-close" data-toggle="navbar-search"><i class="zmdi zmdi-close"></i></button>
                        </form>
                        <div class="navbar-search-backdrop" data-toggle="navbar-search"></div>
                    </div>
                    <!-- /.navbar-search -->
                </li>
                <li id="navbar-search-toggler" class="nav-item hidden-xl-up hidden-sm-down"><a class="nav-link" href="#" data-toggle="navbar-search"><span class="zmdi zmdi-hc-lg zmdi-search"></span></a></li>
                <li class="nav-item dropdown">
                    <a class="nav-link site-user dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img class="nav-img" src="{{url()}}/assets/global/images/user-img.png" alt=""> <span class="nav-text hidden-sm-down ml-2">Daniel</span> <i class="nav-caret hidden-sm-down zmdi zmdi-hc-sm zmdi-chevron-down"></i></a>
                    <div class="dropdown-menu dropdown-menu-right p-0" data-plugin="dropdownCaret"><a class="dropdown-item dropdown-menu-cap">Daniel Alexander</a>
                        <a class="dropdown-item" href="#">
                            <svg class="svg-user-sm-icon mr-2">
                                <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#user-sm" />
                            </svg> <span>My Profile</span> </a>
                        <a class="dropdown-item" href="#">
                            <svg class="svg-list-icon mr-2">
                                <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#list" />
                            </svg> <span>My Tasks</span> </a>
                        <a class="dropdown-item" href="#">
                            <svg class="svg-inbox-icon mr-2">
                                <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#inbox" />
                            </svg> <span>My Inbox</span></a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#">
                            <svg class="svg-files-icon mr-2">
                                <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#files" />
                            </svg> <span>Lock Screen</span> </a>
                        <a class="dropdown-item" href="#">
                            <svg class="svg-logout-icon mr-2">
                                <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#logout" />
                            </svg> <span>Logout</span></a>
                    </div>
                </li>
                <li class="nav-item"><a class="nav-link" href="#side-panel" data-toggle="class" data-class="open"><i class="zmdi zmdi-menu zmdi-hc-lg"></i></a></li>
            </ul>
            <!-- /.navbar-nav -->
        </div>
        <!-- /.navbar-collapse -->
    </nav>
    <!-- /.site-navbar -->
    <aside id="side-panel" class="side-panel">
        <div class="side-panel-tabs">
            <!-- tabs list -->
            <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" href="#friends-panel" data-toggle="tab" role="tab">
                        <svg class="svg-chat-icon">
                            <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#chat" />
                        </svg>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#notifications-panel" data-toggle="tab" role="tab">
                        <svg class="svg-bell-icon">
                            <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#bell" />
                        </svg>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#settings-panel" data-toggle="tab" role="tab">
                        <svg class="svg-cog-icon">
                            <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#cog" />
                        </svg>
                    </a>
                </li>
            </ul>
            <!-- .nav-tabs -->
            <div class="tab-content">
                <div role="tabpanel" class="tab-pane active" id="friends-panel">
                    <div class="scroll-container">
                        <div class="py-4 px-3">
                            <h6 class="text-uppercase m-0 text-muted">Who's Online ?</h6></div>
                        <div class="media-list">
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/203.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Patrice Semo</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/101.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Audry Rowbotham</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/202.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Jonathan Radej</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/204.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Joelle Pabon</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/201.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Fae Atamanczyk</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/101.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">German Rosch</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/102.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Aurora Nemet</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/103.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Letisha Eroman</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/105.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Zina Sivert</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/211.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Annie Vanderbeek</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                            <a href="javascript:void(0)" class="media"><img class="avatar avatar-circle" src="{{url()}}/assets/global/images/208.jpg" alt="">
                                <div class="media-body">
                                    <h6 class="media-heading">Karoline Herrling</h6><small>Lorem ipsum dolor sit amet</small></div>
                            </a>
                        </div>
                        <!-- /.media-list -->
                    </div>
                    <!-- /.scroll-container -->
                </div>
                <!-- /.tab-pane -->
                <div role="tabpanel" class="tab-pane" id="notifications-panel">
                    <div class="scroll-container">
                        <div class="py-4 px-3">
                            <h6 class="text-uppercase m-0 text-muted">Notifications</h6></div>
                        <div class="media-list"><a href="javascript:void(0)" class="media"><span class="avatar bg-success" data-plugin="firstLitter" data-target="#notification-1"></span><div class="media-body"><h6 class="media-heading" id="notification-1">Raye Nolton</h6><small>Lorem ipsum dolor sit amet.</small></div></a><a href="javascript:void(0)" class="media"><span class="avatar bg-info" data-plugin="firstLitter" data-target="#notification-1"></span><div class="media-body"><h6 class="media-heading" id="notification-1">Lucretia Philipson</h6><small>Lorem ipsum dolor sit amet.</small></div></a><a href="javascript:void(0)" class="media"><span class="avatar bg-warning" data-plugin="firstLitter" data-target="#notification-2"></span><div class="media-body"><h6 class="media-heading" id="notification-2">Roxy Heckerman</h6><small>Lorem ipsum dolor sit amet</small></div></a><a href="javascript:void(0)" class="media"><span class="avatar bg-primary" data-plugin="firstLitter" data-target="#notification-3"></span><div class="media-body"><h6 class="media-heading" id="notification-3">Glennis Nest</h6><small>Lorem ipsum dolor sit amet</small></div></a><a href="javascript:void(0)" class="media"><span class="avatar bg-success" data-plugin="firstLitter" data-target="#notification-4"></span><div class="media-body"><h6 class="media-heading" id="notification-4">Basil Hugo</h6><small>Lorem ipsum dolor sit amet</small></div></a><a href="javascript:void(0)" class="media"><span class="avatar bg-danger" data-plugin="firstLitter" data-target="#notification-5"></span><div class="media-body"><h6 class="media-heading" id="notification-5">Anamaria Piedrahita</h6><small>Lorem ipsum dolor sit amet</small></div></a><a href="javascript:void(0)" class="media"><span class="avatar bg-primary" data-plugin="firstLitter" data-target="#notification-6"></span><div class="media-body"><h6 class="media-heading" id="notification-6">Karl SlomaLuanna</h6><small>Lorem ipsum dolor sit amet</small></div></a><a href="javascript:void(0)" class="media"><span class="avatar bg-success" data-plugin="firstLitter" data-target="#notification-7"></span><div class="media-body"><h6 class="media-heading" id="notification-7">Willa Santolucito</h6><small>Lorem ipsum dolor sit amet</small></div></a><a href="javascript:void(0)" class="media"><span class="avatar bg-info" data-plugin="firstLitter" data-target="#notification-8"></span><div class="media-body"><h6 class="media-heading" id="notification-8">Justin Bogaert</h6><small>Lorem ipsum dolor sit amet</small></div></a><a href="javascript:void(0)" class="media"><span class="avatar bg-warning" data-plugin="firstLitter" data-target="#notification-9"></span><div class="media-body"><h6 class="media-heading" id="notification-9">Gino Kinderknecht</h6><small>Lorem ipsum dolor sit amet</small></div></a></div>
                        <!-- /.media-list -->
                    </div>
                    <!-- /.scroll-container -->
                </div>
                <!-- /.tab-pane -->
                <div role="tabpanel" class="tab-pane" id="settings-panel">
                    <div class="scroll-container">
                        <div class="py-4 px-3">
                            <h6 class="text-uppercase m-0 text-muted">Account Settings</h6></div>
                        <div class="p-3">
                            <div class="d-flex mb-3">
                                <label for="user-settings-option1">Show My username</label><span class="ml-auto"><input id="user-settings-option1" type="checkbox" data-plugin="switchry" data-color="#60c84c" data-size="small" checked="checked"></span></div>
                            <div class="d-flex mb-3">
                                <label for="user-settings-option2">Make my profile public</label><span class="ml-auto"><input id="user-settings-option2" type="checkbox" data-plugin="switchry" data-color="#60c84c" data-size="small" checked="checked"></span></div>
                            <div class="d-flex mb-3">
                                <label for="user-settings-option3">Allow cloud backups</label><span class="ml-auto"><input id="user-settings-option3" type="checkbox" data-plugin="switchry" data-color="#60c84c" data-size="small" checked="checked"></span></div>
                        </div>
                        <!-- /.p-3 -->
                    </div>
                    <!-- /.scroll-container -->
                </div>
                <!-- /.tab-pane -->
            </div>
            <!-- /.tab-content -->
        </div>
        <!-- /.side-panel-tabs -->
    </aside>
    <!-- /.side-panel -->
    <div class="site-wrapper">
        <aside class="site-menubar">
            <div class="site-menubar-inner">
                <ul class="site-menu">
                    <!-- MAIN NAVIGATION SECTION -->
                    <li class="menu-section-heading">MAIN NAVIGATION</li>
                    <li><a href="index-2.html"><i class="menu-icon zmdi zmdi-home zmdi-hc-lg"></i> <span class="menu-text">Dashboard</span></a></li>
                    <li><a href="search.html"><i class="menu-icon zmdi zmdi-search zmdi-hc-lg"></i> <span class="menu-text">Search</span></a></li>
                    <li><a href="javascript:void(0)" class="submenu-toggle"><i class="menu-icon zmdi zmdi-pages zmdi-hc-lg"></i> <span class="menu-text">Pages</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                        <ul class="submenu">
                            <li><a href="timeline.html"><span class="menu-text">Timeline</span></a></li>
                            <li><a href="profile.html"><span class="menu-text">Profile</span></a></li>
                            <li><a href="login.html"><span class="menu-text">Login</span></a></li>
                            <li><a href="faq.html"><span class="menu-text">FAQ</span></a></li>
                            <li><a href="price.html"><span class="menu-text">Price</span></a></li>
                            <li><a href="blank.html"><span class="menu-text">Blank Page</span></a></li>
                            <li><a href="javascript:void(0)" class="submenu-toggle"><span class="menu-text">Error</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                                <ul class="submenu">
                                    <li><a href="404.html"><span class="menu-text">404</span></a></li>
                                    <li><a href="403.html"><span class="menu-text">403</span></a></li>
                                    <li><a href="500.html"><span class="menu-text">500</span></a></li>
                                </ul>
                            </li>
                            <li><a href="javascript:void(0)" class="submenu-toggle"><span class="menu-text">Invoice</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                                <ul class="submenu">
                                    <li><a href="invoice.1.html"><span class="menu-text">Invoice v1</span></a></li>
                                    <li><a href="invoice.2.html"><span class="menu-text">Invoice v2</span></a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li><a href="javascript:void(0)" class="submenu-toggle"><i class="menu-icon zmdi zmdi-blogger zmdi-hc-lg"></i> <span class="menu-text">Blog</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                        <ul class="submenu">
                            <li><a href="blog.html"><span class="menu-text">Blog</span></a></li>
                            <li><a href="article.html"><span class="menu-text">Blog Post</span></a></li>
                        </ul>
                    </li>
                    <li><a href="javascript:void(0)" class="submenu-toggle"><i class="menu-icon zmdi zmdi-image zmdi-hc-lg"></i> <span class="menu-text">Gallery</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                        <ul class="submenu">
                            <li><a href="gallery.1.html"><span class="menu-text">Gallery v1</span></a></li>
                            <li><a href="gallery.2.html"><span class="menu-text">Gallery v2</span></a></li>
                            <li><a href="gallery.3.html"><span class="menu-text">Gallery v3</span></a></li>
                        </ul>
                    </li>
                    <!-- FEATURES SECTION -->
                    <li class="menu-section-heading">FEATURES</li>
                    <li><a href="javascript:void(0)" class="submenu-toggle"><i class="menu-icon zmdi zmdi-group zmdi-hc-lg"></i> <span class="menu-text">Layouts</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                        <ul class="submenu">
                            <li><a href="{{url()}}/basic/index.html"><span class="menu-text">Basic</span></a></li>
                            <li><a href="{{url()}}/iconbar/index.html"><span class="menu-text">Iconbar</span></a></li>
                            <li><a href="index-2.html"><span class="menu-text">Leftbar</span></a></li>
                            <li><a href="{{url()}}/topbar/index.html"><span class="menu-text">Topbar</span></a></li>
                        </ul>
                    </li>
                    <li><a href="javascript:void(0)" class="submenu-toggle"><i class="menu-icon zmdi zmdi-puzzle-piece zmdi-hc-lg"></i> <span class="menu-text">UI Kit</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                        <ul class="submenu">
                            <li><a href="uikit.alerts.html"><span class="menu-text">Alerts</span></a></li>
                            <li><a href="uikit.sweetalert.html"><span class="menu-text">Sweetalert</span></a></li>
                            <li><a href="uikit.buttons.html"><span class="menu-text">Buttons</span></a></li>
                            <li><a href="uikit.user-cards.html"><span class="menu-text">User Cards</span></a></li>
                            <li><a href="uikit.blog-widgets.html"><span class="menu-text">Blog Cards</span></a></li>
                            <li><a href="uikit.icons.html"><span class="menu-text">Font Icons</span></a></li>
                        </ul>
                    </li>
                    <li><a href="javascript:void(0)" class="submenu-toggle"><i class="menu-icon zmdi zmdi-pin zmdi-hc-lg"></i> <span class="menu-text">Maps</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                        <ul class="submenu">
                            <li><a href="maps.google.html"><span class="menu-text">Google Maps</span></a></li>
                            <li><a href="maps.jqvmap.html"><span class="menu-text">Vector Maps</span></a></li>
                        </ul>
                    </li>
                    <!-- APPS SECTION -->
                    <li class="menu-section-heading">APPS</li>
                    <li><a href="inbox.html"><i class="menu-icon zmdi zmdi-inbox zmdi-hc-lg"></i> <span class="menu-text">Mail Box</span></a></li>
                    <li><a href="messaging.html"><i class="menu-icon zmdi zmdi-twitch zmdi-hc-lg"></i> <span class="menu-text">Chat</span></a></li>
                    <li><a href="calendar.html"><i class="menu-icon zmdi zmdi-calendar zmdi-hc-lg"></i> <span class="menu-text">Calendar</span></a></li>
                    <li><a href="projects.html"><i class="menu-icon zmdi zmdi-case zmdi-hc-lg"></i> <span class="menu-text">Projects</span></a></li>
                    <!-- DATA SECTION -->
                    <li class="menu-section-heading">DATA</li>
                    <li><a href="javascript:void(0)" class="submenu-toggle"><i class="menu-icon zmdi zmdi-chart zmdi-hc-lg"></i> <span class="menu-text">Charts</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                        <ul class="submenu">
                            <li><a href="charts.echarts.html"><span class="menu-text">Echarts</span></a></li>
                            <li><a href="charts.flot.html"><span class="menu-text">Flot Cahrts</span></a></li>
                            <li><a href="charts.chartist.html"><span class="menu-text">Chartist.js</span></a></li>
                            <li><a href="charts.morris.html"><span class="menu-text">Morris Cahrts</span></a></li>
                            <li><a href="charts.chartjs.html"><span class="menu-text">Chart.js</span></a></li>
                        </ul>
                    </li>
                    <li><a href="javascript:void(0)" class="submenu-toggle"><i class="menu-icon zmdi zmdi-check-all zmdi-hc-lg"></i> <span class="menu-text">Forms</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                        <ul class="submenu">
                            <li><a href="form.wizard.html"><span class="menu-text">Wizard</span></a></li>
                            <li><a href="form.validation.html"><span class="menu-text">Form Validation</span></a></li>
                            <li><a href="form.fileupload.html"><span class="menu-text">File Upload</span></a></li>
                            <li><a href="form.custom.html"><span class="menu-text">Custom Elements</span></a></li>
                            <li><a href="form.datetime.html"><span class="menu-text">Date &amp; Time</span></a></li>
                            <li><a href="form.wysiwyg-editor.html"><span class="menu-text">Summernote Editor</span></a></li>
                            <li><a href="form.bs.html"><span class="menu-text">Bootstrap Forms</span></a></li>
                        </ul>
                    </li>
                    <li><a href="javascript:void(0)" class="submenu-toggle"><i class="menu-icon zmdi zmdi-storage zmdi-hc-lg"></i> <span class="menu-text">Tables</span> <i class="menu-caret zmdi zmdi-hc-sm zmdi-chevron-right"></i></a>
                        <ul class="submenu">
                            <li><a href="table.bs.html"><span class="menu-text">Bootstrap Tables</span></a></li>
                            <li><a href="table.datatables.html"><span class="menu-text">DataTables</span></a></li>
                        </ul>
                    </li>
                    <!-- OTHER SECTION -->
                    <li class="menu-section-heading">OTHER</li>
                    <li><a href="documentation.html"><i class="menu-icon zmdi zmdi-file-text zmdi-hc-lg"></i> <span class="menu-text">Documentation</span></a></li>
                </ul>
                <!-- /.site-menu -->
            </div>
            <!-- /.site-menubar-inner -->
        </aside>
        <!-- /.site-menubar -->
        <main class="site-main">
            <header class="site-header">
                <div class="jumbotron jumbotron-fluid">
                    <div class="jumbotron-text">
                        <h4 class="text-primary">Welcome To PlayKit</h4><small class="font-italic text-muted">Bootstrap 4 Web App Kit</small></div>
                    <!-- /.jumbotron-text -->
                    <div class="jumbotron-charts">
                        <div class="item">
                            <div class="mr-3"><small class="d-block mb-1">STORE INCOME</small>
                                <svg class="svg-euro-icon mr-1">
                                    <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#euro" />
                                </svg> <strong data-plugin="counterUp">6950</strong></div>
                            <div>
                                <div class="jumbotron-chart mt-2" id="jumbotron_chart_1"></div>
                            </div>
                        </div>
                        <!-- /.item -->
                        <div class="item">
                            <div class="mr-3"><small class="d-block mb-1">ORDERS</small>
                                <svg class="svg-caret-icon mr-1">
                                    <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#caret" />
                                </svg> <strong data-plugin="counterUp">7639</strong></div>
                            <div>
                                <div class="jumbotron-chart mt-2" id="jumbotron_chart_2"></div>
                            </div>
                        </div>
                        <!-- /.item -->
                        <div class="item">
                            <div class="mr-3"><small class="d-block mb-1">SITE TRAFFIC</small>
                                <svg class="svg-arrows-up-down-icon mr-1">
                                    <use xlink:href="{{url()}}/assets/global/svg-sprite/sprite.svg#arrows-up-down" />
                                </svg> <strong data-plugin="counterUp">5673</strong></div>
                            <div>
                                <div class="jumbotron-chart mt-2" id="jumbotron_chart_3"></div>
                            </div>
                        </div>
                        <!-- /.item -->
                    </div>
                    <!-- /.jumbotron-charts -->
                </div>
                <!-- /.jumbotron -->
                <div class="breadcrumb">
                    <ol class="breadcrumb-tree">
                        <li class="breadcrumb-item"><a href="#"><span class="zmdi zmdi-home mr-1"></span> <span>Home</span></a></li>
                        <li class="breadcrumb-item active"><a href="#">PlayKit</a></li>
                    </ol>
                    <ul class="breadcrumb-btns">
                        <li class="dropdown"><a href="#" class="btn btn-sm btn-scondary dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="zmdi zmdi-settings mr-1 text-success"></i> <span class="mr-1">Settings</span> <i class="zmdi zmdi-chevron-down"></i></a>
                            <div class="dropdown-menu p-0 mt-1" data-plugin="dropdownCaret"><a class="dropdown-item dropdown-menu-cap">Your Settings</a> <a class="dropdown-item" href="#">Edit Profile</a> <a class="dropdown-item" href="#">Privacy Settings</a> <a class="dropdown-item" href="#">Secuirty Settings</a></div>
                        </li>
                        <li><a href="#" class="btn btn-sm btn-scondary"><i class="zmdi zmdi-headset-mic mr-1 text-success"></i> <span>Support</span></a></li>
                        <li><a href="#" class="btn btn-sm btn-scondary"><i class="zmdi zmdi-plus mr-1 text-success"></i> <span>Add</span></a></li>
                    </ul>
                </div>
                <!-- /.breadcrumb -->
            </header>
            <!-- /.site-header -->
            <section class="site-content">
                <h2>Blank Page</h2>
                <p>This is a blank page with the minimum dependencies, you can use it for any purpose.</p>
            </section>
            <!-- /.site-content -->
            <footer class="site-footer">
                <div class="mr-auto">
                    <p class="text-primary mb-0">Made With <i class="fa fa-heart text-success"></i> By <a href="http://spantags.com/playkit/">SpanTags</a></p>
                </div>
                <div><a href="https://themeforest.net/item/playkit-responsive-bootstrap-4-admin-template-build-system/19481175">Purchase PlayKit</a></div>
            </footer>
            <!-- /.site-footer -->
        </main>
        <!-- /.site-main -->
    </div>
    <!-- /.site-warpper -->
    <div class="modal fade video-modal" id="video-modal" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <iframe src="about:blank" width="760" height="440" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
        </div>
    </div>
    <!-- #video-modal -->
    <!-- theme customizer -->
    <div id="theme-customizer">
        <section class="bg-white border-b-1"><a href="https://themeforest.net/item/playkit-responsive-bootstrap-4-admin-template-build-system/19481175" class="btn btn-block btn-lg btn-success fz-base">BUY PlayKit NOW!</a>
            <hr>
            <div class="d-flex justify-content-between customizer-action-btns">
                <button id="customizerResetButton" class="btn btn-outline-danger">Reset</button>
                <button id="customizerSaveButton" class="btn btn-outline-success">Save</button>
            </div>
        </section>
        <div class="theme-customizer-inner">
            <section>
                <h6 class="mb-4">Theme</h6>
                <!-- light navbar  -->
                <div class="theme-sector-row">
                    <label class="theme-sector theme-sector-navbar-light">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="inverse" data-navbar-type="light" data-navbar-skin="bg-faded" checked="checked">
                        <div class="theme-demo"><span class="navbar-demo bg-faded"></span> <span class="menubar-demo bg-primary"></span></div>
                    </label>
                    <label class="theme-sector theme-sector-navbar-light">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="light" data-navbar-type="light" data-navbar-skin="bg-faded">
                        <div class="theme-demo"><span class="navbar-demo bg-faded"></span> <span class="menubar-demo bg-white"></span></div>
                    </label>
                </div>
                <!-- /.theme-sector-row -->
                <div class="theme-sector-row">
                    <label class="theme-sector theme-sector-navbar-light">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="inverse" data-navbar-type="light" data-navbar-skin="bg-white">
                        <div class="theme-demo"><span class="navbar-demo bg-white"></span> <span class="menubar-demo bg-primary"></span></div>
                    </label>
                    <label class="theme-sector theme-sector-navbar-light">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="light" data-navbar-type="light" data-navbar-skin="bg-white">
                        <div class="theme-demo"><span class="navbar-demo bg-white"></span> <span class="menubar-demo bg-white"></span></div>
                    </label>
                </div>
                <!-- /.theme-sector-row -->
                <!-- inverse navbar -->
                <div class="theme-sector-row">
                    <!-- warning navbar -->
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="inverse" data-navbar-type="inverse" data-navbar-skin="bg-black">
                        <div class="theme-demo"><span class="navbar-demo bg-black"></span> <span class="menubar-demo bg-primary"></span></div>
                    </label>
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="light" data-navbar-type="inverse" data-navbar-skin="bg-black">
                        <div class="theme-demo"><span class="navbar-demo bg-black"></span> <span class="menubar-demo bg-white"></span></div>
                    </label>
                </div>
                <!-- /.theme-sector-row -->
                <div class="theme-sector-row">
                    <!-- primary navbar -->
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="inverse" data-navbar-type="inverse" data-navbar-skin="bg-primary">
                        <div class="theme-demo"><span class="navbar-demo bg-primary"></span> <span class="menubar-demo bg-primary"></span></div>
                    </label>
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="light" data-navbar-type="inverse" data-navbar-skin="bg-primary">
                        <div class="theme-demo"><span class="navbar-demo bg-primary"></span> <span class="menubar-demo bg-white"></span></div>
                    </label>
                </div>
                <!-- /.theme-sector-row -->
                <div class="theme-sector-row">
                    <!-- warning navbar -->
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="inverse" data-navbar-type="inverse" data-navbar-skin="bg-warning">
                        <div class="theme-demo"><span class="navbar-demo bg-warning"></span> <span class="menubar-demo bg-primary"></span></div>
                    </label>
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="light" data-navbar-type="inverse" data-navbar-skin="bg-warning">
                        <div class="theme-demo"><span class="navbar-demo bg-warning"></span> <span class="menubar-demo bg-white"></span></div>
                    </label>
                </div>
                <!-- /.theme-sector-row -->
                <div class="theme-sector-row">
                    <!-- info navbar -->
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="inverse" data-navbar-type="inverse" data-navbar-skin="bg-info">
                        <div class="theme-demo"><span class="navbar-demo bg-info"></span> <span class="menubar-demo bg-primary"></span></div>
                    </label>
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="light" data-navbar-type="inverse" data-navbar-skin="bg-info">
                        <div class="theme-demo"><span class="navbar-demo bg-info"></span> <span class="menubar-demo bg-white"></span></div>
                    </label>
                </div>
                <!-- /.theme-sector-row -->
                <div class="theme-sector-row">
                    <!-- danger navbar -->
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="inverse" data-navbar-type="inverse" data-navbar-skin="bg-danger">
                        <div class="theme-demo"><span class="navbar-demo bg-danger"></span> <span class="menubar-demo bg-primary"></span></div>
                    </label>
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="light" data-navbar-type="inverse" data-navbar-skin="bg-danger">
                        <div class="theme-demo"><span class="navbar-demo bg-danger"></span> <span class="menubar-demo bg-white"></span></div>
                    </label>
                </div>
                <!-- /.theme-sector-row -->
                <div class="theme-sector-row">
                    <!-- success navbar -->
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="inverse" data-navbar-type="inverse" data-navbar-skin="bg-success">
                        <div class="theme-demo"><span class="navbar-demo bg-success"></span> <span class="menubar-demo bg-primary"></span></div>
                    </label>
                    <label class="theme-sector">
                        <input type="radio" name="theme-option" data-toggle="theme" data-menubar-type="light" data-navbar-type="inverse" data-navbar-skin="bg-success">
                        <div class="theme-demo"><span class="navbar-demo bg-success"></span> <span class="menubar-demo bg-white"></span></div>
                    </label>
                </div>
                <!-- /.theme-sector-row -->
            </section>
            <hr class="m-0">
            <section>
                <h6 class="mb-4">Navbar Skin</h6>
                <div class="mb-3">
                    <div class="radio">
                        <input type="radio" id="nb-skin-1" name="navbar-skin-option" data-toggle="theme" data-navbar-type="light" data-navbar-skin="bg-faded" checked="checked">
                        <label for="nb-skin-1">Faded</label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="radio">
                        <input type="radio" id="nb-skin-2" name="navbar-skin-option" data-toggle="theme" data-navbar-type="light" data-navbar-skin="bg-white">
                        <label for="nb-skin-2">White</label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="radio radio-black">
                        <input type="radio" id="nb-skin-3" name="navbar-skin-option" data-toggle="theme" data-navbar-type="inverse" data-navbar-skin="bg-black">
                        <label for="nb-skin-3" class="text-black">Black</label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="radio radio-primary">
                        <input type="radio" id="nb-skin-4" name="navbar-skin-option" data-toggle="theme" data-navbar-type="inverse" data-navbar-skin="bg-primary">
                        <label for="nb-skin-4" class="text-primary">Primary</label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="radio radio-warning">
                        <input type="radio" id="nb-skin-5" name="navbar-skin-option" data-toggle="theme" data-navbar-type="inverse" data-navbar-skin="bg-warning">
                        <label for="nb-skin-5" class="text-warning">Warning</label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="radio radio-info">
                        <input type="radio" id="nb-skin-6" name="navbar-skin-option" data-toggle="theme" data-navbar-type="inverse" data-navbar-skin="bg-info">
                        <label for="nb-skin-6" class="text-info">Info</label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="radio radio-danger">
                        <input type="radio" id="nb-skin-7" name="navbar-skin-option" data-toggle="theme" data-navbar-type="inverse" data-navbar-skin="bg-danger">
                        <label for="nb-skin-7" class="text-danger">Danger</label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="radio radio-success">
                        <input type="radio" id="nb-skin-8" name="navbar-skin-option" data-toggle="theme" data-navbar-type="inverse" data-navbar-skin="bg-success">
                        <label for="nb-skin-8" class="text-success">Success</label>
                    </div>
                </div>
            </section>
            <hr class="m-0">
            <section>
                <h6 class="mb-4">Menubar Skin</h6>
                <div class="mb-3">
                    <div class="radio">
                        <input type="radio" id="mb-type-1" name="menubar-type-option" data-toggle="theme" data-menubar-type="light">
                        <label for="mb-type-1">Light</label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="radio radio-primary">
                        <input type="radio" id="mb-type-2" name="menubar-type-option" data-toggle="theme" data-menubar-type="inverse" checked="checked">
                        <label for="mb-type-2" class="text-primary">Inverse</label>
                    </div>
                </div>
            </section>
        </div>
        <!-- /.theme-customizer-inner -->
        <div id="theme-customizer-toggler" data-toggle="class" data-target="#theme-customizer" data-class="show"><i class="fa fa-gear fa-2x"></i></div>
    </div>
    <!-- /.theme-customizer -->
    <!-- core plugins -->

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
</body>

</html>