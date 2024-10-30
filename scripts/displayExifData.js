/*
 * JavaScript to display Image data
 */

class Accordion {
        // creates a jQuery UI accordion widget from the EXIF data
        // each section is an EXIF section

        constructor( data ) {
                this.html = "";

                this.build( data );
                this.show( data['FILE' ]['FileName'] );
         }

        startSection( name ) {
            // start of an EXIF section

            this.html += "<h3>" + name + "</h3>\n";
            this.html += "<div>\n";
            this.html += "<p>\n";

            this.html += '<table class="table">\n';
            this.html += '<thead>\n';
            this.html += '<tr>\n';
            this.html += '<th style="text-align: left" scope="col">Field</th>\n';
            this.html += '<th style="text-align: left" scope="col">Value</th>\n';
            this.html += '</tr>\n';
            this.html += '</thead>\n';
            this.html += '<tbody>\n';
        }

        endSection() {
            // end of an EXIF section

            this.html += '</tbody>\n';
            this.html += '</table>\n';
            this.html += '</p>\n';
            this.html += '</div>\n';
        }

        addSectionRow( field, value ) {
            // a row in a table for each EXIF section item

            this.html += '<tr>\n';
            this.html += '<td>' + field + '</td>\n';
            this.html += '<td>' + value + '</td>\n';
            this.html += '</tr>\n';
        }

        build( data ) {
            // build the html for the accordian

            this.html = '<div id="accordion">\n';

            for( const section in data ) {
                    this.startSection( section );

                    for( const field in data[ section ] ) {
                            this.addSectionRow( field, data[ section][field] );
                    }

                    this.endSection();
            }

            this.html += "</div>\n"; // accordion
        }

        show( title ) {
            // from built html display using accordion widget using a popup
               
            jQuery( document.body ).append( '<div id="metaData" style="display: none;">' );
            jQuery( document.body ).append( '</div>' );

            document.getElementById( "metaData" ).innerHTML = this.html;

            jQuery( function() {  
                    jQuery( "#accordion" ).accordion( {
                             heightStyle: "content",
                             collapsible: true,
                             active: false
                     }); 
            });

            // calcuate proper dialog dimension
            let width = jQuery( window ).width() * .50;
            width = width < 350 ? 350 : width;
            let height = jQuery( window ).height() * .50;
            height = height < 600 ? 600 : height;

            jQuery( "#metaData" ).dialog({
                  title: 'EXIF for ' + title,
                  dialogClass: "no-close",
                  width: width,
                  height: height,
                  minWidth: 350,
                  minHeight: 650,
                  modal: true,
                  buttons: [
                    {
                      text: "OK",
                      click: function() {
                        jQuery( this ).dialog( "close" );
                        jQuery( "#metaData" ).remove();
                      }
                    }
                  ]
             });
        }
}

function noEXIFData( fullPath ) {
        jQuery( document.body ).append( '<div id="metaData" style="display: none;"></div>' );
        jQuery( "#metaData" ).append( '<p>No EXIF data available</p>' );

        var filename = fullPath.replace(/^.*[\\\/]/, '')

        jQuery( "#metaData" ).dialog({
                  title: 'EXIF for ' + filename,
                  dialogClass: "no-close",
                  modal: true,
                  buttons: [
                    {
                      text: "OK",
                      click: function() {
                        jQuery( this ).dialog( "close" );
                        jQuery( "#metaData" ).remove();
                      }
                    }
                  ]
             });
}

function getMetaData( file, type, nonce ) {
        var scriptSource = (function(scripts) {
            var scripts = document.getElementsByTagName('script'),
                script = scripts[scripts.length - 1];

            var uri = script.baseURI.match( /^(\S+)\/wp-admin/ );

            return uri[1];
        }());

        jQuery.ajax({
              type     : "get",
              dataType : "json",
              url      : scriptSource + "/wp-admin/admin-ajax.php",
              data     : { action: type, file: file, nonce: nonce },
              success  : function(response) {
                            if( response ) {
                                    accordion = new Accordion( response );
                            } else {
                                    noEXIFData( file );
                            }
                         },
              error    : function(jqxhr, textStatus, exception) {
                             alert( "Exception: " + exception );
                         }
       });
}

function showExifData( file, nonce ) {
        getMetaData( file, 'getExif', nonce );
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function addNextgenInfoLink( base, nonce ) {
        // Nextgen does its own thing WRT row-actions
        // easier to do it with JS

        if( getParameterByName( 'page' )  !== 'nggallery-manage-gallery' ) 
                return;
        if( getParameterByName( 'mode' )  !== 'edit' ) 
                return;

        jQuery( ".row-actions" ).html( ( i, content ) => {
                let url = content.match( /^<a href=\"https?:\S+(wp-content\S+)\"/ );
                let path = base + "/" + url[1];
                return content + ' | <a href="#" onclick="showExifData( \'' + path + '\', \'' + nonce + '\' ); return false;">View EXIF</a>';
        });
}
