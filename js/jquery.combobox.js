	(function( $ ) {
		$.widget( "ui.combobox", {
			input: null,
			button: null,
			options: {
			 'editable': false,
			 'value': null
		   },
			_create: function() {
				var self = this,
					select = this.element.hide(),
					selected = select.children( ":selected" )?select.children( ":selected" ):select.children( "option:first" ),
					value = this.options['value']?this.options['value']:(selected.val() ? selected.text():"");
					if(selected && selected.val()!=value){
						select.children("option").each(function(){
							if(this.innerText == value)
								this.selected = true;
								return false;
						});
					}
				this.input = $( "<input>" )
					.insertAfter( select )
					.val( value )
					.css({
						"height": "25px !important",
						"box-sizing": "border-box"
					})
					.autocomplete({
						delay: 0,
						minLength: 0,
						source: function( request, response ) {
							var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
							response( select.children( "option" ).map(function() {
								var text = $( this ).text();
								if ( this.value && ( !request['term'] || matcher.test(text) ) )
									return {
										label: text.replace(
											new RegExp(
												"(?![^&;]+;)(?!<[^<>]*)(" +
												$['ui']['autocomplete']['escapeRegex'](request['term']) +
												")(?![^<>]*>)(?![^&;]+;)", "gi"
											), "<strong>$1</strong>" ),
										value: text,
										option: this
									};
							}) );
						},
						select: function( event, ui ) {
							ui.item.option.selected = true;
							self._trigger( "selected", event, {
								item: ui.item.option
							});
						},
						change: function( event, ui ) {
							if ( !ui.item ) {
								var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
									valid = false;
								select.children( "option" ).each(function() {
									if ( this.value.match( matcher ) ) {
										this.selected = valid = true;
										return false;
									}
								});
								if ( !valid ) {
									// remove invalid value, as it didn't match anything
									if(!self.options['editable']){
										$( this ).val(select.children(":selected").text());
									}
									return false;
								}
							}
						}
					})
					.addClass( "ui-widget ui-widget-content ui-corner-left" );

				this.input.data( "autocomplete" )._renderItem = function( ul, item ) {
					return $( "<li></li>" )
						.data( "item.autocomplete", item )
						.append( "<a>" + item.label + "</a>" )
						.appendTo( ul );
				};

				this.button = $( "<button>&nbsp;</button>" )
					.attr( "tabIndex", -1 )
					.attr( "title", "Show All Items" )
					.insertAfter( this.input )
					.button({
						icons: {
							primary: "ui-icon-triangle-1-s"
						},
						text: false
					})
					.removeClass( "ui-corner-all" )
					.addClass( "ui-corner-right ui-button-icon" )
					.click(function() {
						// close if already visible
						if ( self.input.autocomplete( "widget" ).is( ":visible" ) ) {
							self.input.autocomplete( "close" );
							return;
						}

						// pass empty string as value to search for, displaying all results
						self.input.autocomplete( "search", "" );
						self.input.focus();
					});
				this.disable(select.attr("disabled"))
			},
			value: function(newValue) {
				if(typeof newValue === 'undefined'){
					if(this.options.editable){
						return this.input.val();
					} else {
						return this.element.val();
					}
				} else {
					this.input.val(newValue);
					this.element.val(newValue)
				}
			},
			label: function() {
					if(this.options.editable){
						return this.input.val();
					} else {
						return this.element.children( ":selected" ).text()
					}
		   },
		   disable: function(state){
			this.input.attr("disabled", state);//.toggleClass('ui-state-disabled');
			this.button.attr("disabled", state);//.toggleClass('ui-state-disabled');
		   }
		});
	})( jQuery );