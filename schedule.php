<?php
// Time-boxed content: wrap a block in `if (visible('2026-10-16 08:00', '2026-12-15 12:00'))`
// so it appears/disappears on its own, without a redeploy. Either bound may be null.
// All times are Budapest local time.
date_default_timezone_set('Europe/Budapest');

function visible($from = null, $until = null) {
    $now = time();
    // The local preview server (php -S) ignores start times, so scheduled items can be
    // reviewed before they go live. End times still apply there.
    $ignoreFrom = PHP_SAPI === 'cli-server';
    return ($ignoreFrom || !$from || $now >= strtotime($from))
        && (!$until || $now < strtotime($until));
}
