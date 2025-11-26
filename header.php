<!DOCTYPE html>
<html>
    <head>
        <title>Jánkmajtis község</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- fancybox -->
        <link rel="stylesheet" type="text/css" href="fancybox/jquery.fancybox.css?v=2.1.5" media="screen" />

        <!-- W3.CSS -->
        <link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">

        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

        <!-- Custom styles -->
        <link rel="stylesheet" type="text/css" href="css/jankmajtis.css?v=4">
        <link rel="stylesheet" type="text/css" href="css/jankmajtis.mobile.css?v=2">

    </head>
    <body>

        <div id="wrapper">

            <div id="header">

                <img class="headerImage" src="images_jpg/slides/slide0.jpg" alt="slide0">
                <img class="headerImage" src="images_jpg/slides/slide1.jpg" alt="slide1">
                <img class="headerImage" src="images_jpg/slides/slide2.jpg" alt="slide2">
                <img class="headerImage" src="images_jpg/slides/slide3.jpg" alt="slide3">
                <img class="headerImage" src="images_jpg/slides/slide4.jpg" alt="slide4">

                <a href="index.php">
                    <div id="subheader">
                        <div id="crest">
                            <img src="images_png/cimer_jo_kicsi_javitott.png" alt="Cimer" />
                        </div>
                    </div>
                </a>
            </div>

            <div id="menuBar">
                <img id="crest-mobile" src="images_png/cimer_jo_kicsi_javitott_korvonal.png" alt="Cimer" />
                <div id="headerCaption-mobile">
                    <h3>Jánkmajtis</h3>
                </div>

                <a href="index.php"><div class="menuBtn">Főoldal</div></a>
                <div class="menuBtn subbedMenu" onclick="submenu(0)">Településünk</div>
                <div class="menuBtn subbedMenu" onclick="submenu(1)">Önkormányzat</div>
                <div class="menuBtn subbedMenu" onclick="submenu(2)">Intézmények</div>
                <a href="egyhazak.php"><div class="menuBtn">Egyházak</div></a>
                <div class="menuBtn subbedMenu" onclick="submenu(3)">Civil szervezetek</div>
                <div class="menuBtn subbedMenu" onclick="submenu(4)">Vállalkozások</div>
                <div class="menuBtn subbedMenu" onclick="submenu(5)">Pályázatok</div>
                <div class="menuBtn subbedMenu" onclick="submenu(6)">Választási információk</div>
                <div class="menuBtn subbedMenu" onclick="submenu(7)">Gazdálkodási adatok</div>
                <a href="ASP.html" target="_blank"><div class="menuBtn">ASP Központ<i class="fa-solid fa-menu fa-arrow-up-right-from-square"></i></div></a>
            
                <div id="burger" onclick="mainmenu()">
                    <span class="burgerLine"></span>
                    <span class="burgerLine"></span>
                    <span class="burgerLine"></span>
                </div>
            </div>

            <div id="mainMenu">
                <ul>
                    <li><a href="index.php">Főoldal</a>
                    </li>
                    <li onclick="submenu(0)"><a>Településünk</a>
                    </li>
                    <li onclick="submenu(1)"><a>Önkormányzat</a>
                    </li>
                    <li onclick="submenu(2)"><a>Intézmények</a>
                    </li>
                    <li><a href="egyhazak.php">Egyházak</a>
                    </li>
                    <li onclick="submenu(3)"><a>Civil szervezetek</a>
                    </li>
                    <li onclick="submenu(4)"><a>Vállalkozások</a>
                    </li>
                    <li onclick="submenu(5)"><a>Pályázatok</a>
                    </li>
                    <li onclick="submenu(6)"><a>Választási információk</a>
                    </li>
                    <li onclick="submenu(7)"><a>Gazdálkodási adatok</a>
                    </li>
                    <li><a href="ASP.html" target="_blank">ASP Központ<i class="fa-solid fa-menu fa-arrow-up-right-from-square"></i></a>
                    </li>
                </ul>
            </div>


            <div class="subMenu">
                <div class="subMenuContainer">
                    <ul>
                        <li><a href="kozsegunkrol.php">A község bemutatása</a>
                        </li>
                        <li><a href="diszpolgarok.php">Díszpolgárok</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="subMenu">
                <div class="subMenuContainer">
                    <ul>
                        <li><a href="./korjegyzoseg.php">Körjegyzőség</a>
                        </li>
                        <li><a href="./kisebbsegionk.php">Roma Nemzetiségi Önkormányzat</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="subMenu">
                <div class="subMenuContainer">
                    <ul>
                        <li><a href="./iskola.php">Általános iskola</a>
                        </li>
                        <li><a href="./ovoda.php">Óvoda</a>
                        </li>
                        <li><a href="./gondozasikp.php">Gondozási központ</a>
                        </li>
                        <li><a href="./muvhaz.php">Művelődési ház</a>
                        </li>
                        <li><a href="./gyermekjoleti.php">Gyermekjóléti és családsegítő szolgálat</a>
                        </li>
                        <li><a href="./tamogatoszolg.php">Támogató szolgálat</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="subMenu">
                <div class="subMenuContainer">
                    <ul>
                        <li><a href="./noszovetseg.php">Nőszövetség</a>
                        </li>
                        <li><a href="./polgarorseg.php">Polgárőrség</a>
                        </li>
                        <li><a href="./futbalse.php">Jánkmajtis KSE</a>
                        </li>
                        <li><a href="./nyugdijasklub.php">Nyugdíjasklub</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="subMenu">
                <div class="subMenuContainer">
                    <ul>
                        <li><a href="./docs/vallalkozasok.pdf" target="_blank">Jánkmajtison működő vállalkozások<i class="fa-solid fa-menu fa-file-pdf"></i></a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="subMenu">
                <div class="subMenuContainer">
                    <ul>
                        <li><a href="./napelem.php">Napelemes rendszer telepítése</a>
                        </li>
                        <li><a href="./ovodafejlesztes.php">Napközi Otthonos Óvoda fejlesztése</a>
                        </li>
                        <li><a href="./docs/GondKozpKonyhaFejlesztes.pdf" target="_blank">Gondozási Központ konyhájának fejlesztése<i class="fa-solid fa-menu fa-file-pdf"></i></a>
                        </li>
                        <li><a href="./docs/KoztemetoFejlesztes.pdf" target="_blank">Köztemető fejlesztése<i class="fa-solid fa-menu fa-file-pdf"></i></a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="subMenu">
                <div class="subMenuContainer">
                    <div class="subMenuHeader">Jánkmajtis</div>
                    <ul>
                        <li><a href="./valasztas-jm-szervek.php">Választási szervek</a>
                        </li>
                        <li><a href="https://www.valasztas.hu/ugyintezes" target="_blank">Választási ügyintézés<i class="fa-solid fa-menu fa-arrow-up-right-from-square"></i></a>
                        </li>
                        <li><a href="https://www.valasztas.hu/" target="_blank">2026. évi választások<i class="fa-solid fa-menu fa-arrow-up-right-from-square"></i></a>
                        </li>
                        <li><a href="./valasztas-jm-korabbi.php">Korábbi választások</a>
                        </li>
                    </ul>
                    <div class="subMenuHeader" style="margin-top: 20px">Darnó</div>
                    <ul>
                        <li><a href="./valasztas-dr-szervek.php">Választási szervek</a>
                        </li>
                        <li><a href="https://www.valasztas.hu/ugyintezes" target="_blank">Választási ügyintézés<i class="fa-solid fa-menu fa-arrow-up-right-from-square"></i></a>
                        </li>
                        <li><a href="https://www.valasztas.hu/" target="_blank">2026. évi választások<i class="fa-solid fa-menu fa-arrow-up-right-from-square"></i></a>
                        </li>
                        <li><a href="./valasztas-dr-korabbi.php">Korábbi választások</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="subMenu">
                <div class="subMenuContainer">

                    <div class="subMenuHeader">Közérdekű adatok</div>
                    <ul>
                        <li><a href="./docs/gazdalkodas/gazdalkodasi_adatok.pdf" target="_blank">Az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény 1. melléklete szerinti általános közzétételi lista<i class="fa-solid fa-menu fa-file-pdf"></i></a></li>
                    </ul>

                    <div class="subMenuHeader">A működés törvényessége, ellenőrzések</div>
                    <ul>
                        <li><a href="./gazd_vizsgalatok.php">Vizsgálatok, ellenőrzések listája</a></li>
                        <li><a href="./gazd_asz.php">Az Állami Számvevőszék ellenőrzései</a></li>
                        <li><a href="./gazd_egyeb.php">Egyéb ellenőrzések, vizsgálatok</a></li>
                        <li>Működés eredményessége, teljesítmény</li>
                        <li>Működési statisztika</li>
                    </ul>

                    <div class="subMenuHeader" style="margin-top: 20px">Költségvetések, beszámolók</div>
                    <ul>
                        <li><a href="./gazd_eves_koltsegvetesek.php">Éves költségvetések, számviteli beszámolók, a költségvetés végrehajtása</a></li>
                    </ul>

                    <div class="subMenuHeader" style="margin-top: 20px">Működés</div>
                    <ul>
                        <li>A foglalkoztatottak (a létszám, illetmények, juttatások és költségtérítések adatait a költségvetési beszámoló tartalmazza)</li>
                        <li><a href="./gazd_tamogatasok.php">Támogatások</a></li>
                        <li>Szerződések</li>
                        <li>Koncessziók</li>
                        <li>Egyéb kifizetések</li>
                </div>
            </div>
