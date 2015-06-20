<?php
/*
 * wct2015 functions and definitions
 *
 * Set up the content width value based on the theme's design.
 *
 * @see twentythirteen
 *
 * @since wct2015 0.0.1
 */


/*
 * Enqueue scripts and styles for the front end.
 */
// add_action( 'wp_deregister_style', 'theme_enqueue_styles' );
add_action( 'wct2015_enqueue_styles' );
function wct2015_enqueue_styles() {
		// deregister twentythirteen styles
		// wp_deregister_style( 'twentythirteen-style', get_template_directory_uri() . '/style.css' );
		// register custom css
    wp_enqueue_style( 'wct2015', get_template_directory_uri() . './custom.css' );
}
?>
