<?php
/*
	Plugin Name: kidona-exif
	Plugin URI: kidona.com/kidona-exif
	Description: Displays EXIF data for images in the Wordpress Media Library and NextGEN Manage Galleries
	Version: 1.0.1
	Author: Don Fadel
	Author URI: kidona.com
	License:  GPL
	© 2020 Donald J. Fadel, Jr.
 */

namespace Kidona;

class KidonaMeta {
        function __construct() {
                add_action( 'admin_enqueue_scripts', array( $this,'add_scripts' ) );
                add_action( 'wp_ajax_getExif', array( $this,'getExif' ) );
                add_filter( 'media_row_actions', array( $this, 'addMediaInfoLinks' ), 10, 1 );
                add_action( 'admin_footer', array( $this, 'addNextgenInfoLinks' ), 10, 1 );
        }

        function add_scripts( $hook ) {
                if( $hook == 'upload.php' || preg_match( '/^nextgen-gallery_page/', $hook ) ) {
                        // carry on
                } else {
                        return;
                }

                /* jQuery UI */
                wp_enqueue_script( 'jquery-ui-dialog' );
                wp_enqueue_script( 'jquery-ui-widget' );
                wp_enqueue_script( 'jquery-ui-accordion' );

                wp_register_style('jquery-custom-style', plugin_dir_url(__FILE__).'css/jquery-ui-themes-1.12.1/themes/smoothness/jquery-ui.css' ); 
                wp_enqueue_style('jquery-custom-style' );
                wp_register_style('jquery-my-custom-style', plugin_dir_url(__FILE__).'css/jquery-ui-custom.css' ); 
                wp_enqueue_style('jquery-my-custom-style' );

                /* Bootstrap */
                // Bootsrap messes with admin pages, so only include what we need
                wp_register_style('bootstrap-tables', plugin_dir_url(__FILE__).'css/bootstrap-tables.css' ); 
                wp_enqueue_style( 'bootstrap-tables' );

                /* my stuff */
                wp_enqueue_script( 'displayData', plugin_dir_url( __FILE__ ) . 'scripts/displayExifData.js' );
        }

        function getExif( ) {
                // AJAX response
                // we're passed the file name as a get query parm

                $file = $_GET[ 'file' ];
                $nonce = $_GET[ 'nonce' ];

                try {
                        if( ! wp_verify_nonce( $nonce ) ) 
                                throw new \Exception( "invalid nonce" );

                        if( ! file_exists( $file ) ) 
                                throw new \Exception( "$file does not exist" );


                        $imgType = exif_imagetype( $file );

                        switch( $imgType ) {
                                case IMAGETYPE_GIF  :
                                case IMAGETYPE_JPEG :
                                case IMAGETYPE_PNG  :
                                case IMAGETYPE_ICO  : break;
                                default             : throw new \Exception( "unsupported file type" );
                        }
                
                        $exif = exif_read_data( $file, 'IFD0', true );
                        // if it returns false, the decision here is to not count it as an exception
                        // false will be returned and the success handler will check for false
                        // meaning no data available
                } catch( \Exception $ex ) {
                        header('HTTP/1.1 500 ' . $ex->getMessage() );
                        header('Content-Type: application/json; charset=UTF-8');
                        die(json_encode(array('message' => $ex->getMessage(), 'code' => 500)));
                }

                echo json_encode( $exif );
                wp_die();
        }

        function addMediaInfoLinks( $actions ) {
                // this adds the EXIF option to the list of actions in the media library
                try {
                        if( preg_match( '/post=(\d+)&/', $actions[ 'edit' ], $matches ) != 1 )
                                throw new \Exception( "can't find Post ID" );

                        $file = get_attached_file( $matches[1] );
                        if( $file === false )
                                throw new \Exception( "can't get file name" );

                        $nonce = wp_create_nonce();

                        $actions[ 'Exif' ] = '<a href="#" onclick="showExifData( \'' . $file . '\', \'' . $nonce . '\'); return false;">View EXIF</a>';
                } catch( \Exception $ex ) {
                        // oops
                }
                return $actions;
        }

        function addNextgenInfoLinks() {
            if( isset( $_GET[ 'page' ] ) )
                    if( $_GET[ 'page' ] == 'nggallery-manage-gallery' ) {
                        $nonce = wp_create_nonce();
                        echo "<script>\n";
                        echo "addNextgenInfoLink( '" . ABSPATH . "','" . $nonce . "');\n";
                        echo "</script>\n";
                    }
        }
}

$meta = new KidonaMeta();

