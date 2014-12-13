$("#select_method").on("click", "span", function()
{
	/* Toggle active method button */
	$('#select_method').find('span.active').toggleClass('active');
	$(this).toggleClass('active');


	/* Replace placeholder */
	var input_method = $(this).attr('id');
	var replacing_placeholder = "";

	if (input_method === "recipe_name")
		replacing_placeholder = "Type recipe name here...";
	else if (input_method === "ingredient")
		replacing_placeholder = "Type ingredient name here...";
	else if (input_method === "product")
		replacing_placeholder = "Type product name here..";

	$('#search_method').attr('placeholder',replacing_placeholder);
	$('#search_method').focus();
});

$("#searchbar").submit(function(){
	var method = $('#select_method').find('span.active').attr('id');
	var input_content = $('#search_method').val();
	console.log(method);
	console.log(input_content);
	

});