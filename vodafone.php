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
                <div id="vodaFormContainer" class="col-12">
                    <img src="images_png/vodafonelogo.png" alt="Vodafone">
                    <p><strong>A lista letöltéséhez kérem adja meg a kapcsolattartótól kapott jelszót:</strong></p>
                    <form id="vodaForm" method="POST">
                        <input id="vodaPassword" name="vodaPassword" type="password" autofocus />
                        <input type="submit" value="Letöltés"/>
                    </form>
                    <div id="vodaAlert"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js"></script>

<?php
include('footer.php');
?>
