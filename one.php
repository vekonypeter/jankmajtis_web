<?php
include('header.php');
?>
<div id="content">

    <div id="sideleft">

        <div id="sideBarGrey">

            <div id="headerCaption" class="sideBarElement">
                Jánkmajtis<br /><span class="lower">község<br />honlapja</span>
            </div>

            <div id="pageName" class="sideBarElement">Kormányzati csomagos készülékárlista</div>

        </div>
    </div>

    <br>

    <div id="sideright"> 
        <div class="contentContainer">
            <div class="new row">
                <div id="oneFormContainer" class="col-12">
                    <img src="images_png/onelogo.png" alt="One">
                    <p><strong>A lista letöltéséhez kérem adja meg a kapcsolattartótól kapott jelszót:</strong></p>
                    <form id="oneForm" method="POST">
                        <input id="onePassword" name="onePassword" type="password" autofocus />
                        <input type="submit" value="Letöltés"/>
                    </form>
                    <div id="oneAlert"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js"></script>

<?php
include('footer.php');
?>
