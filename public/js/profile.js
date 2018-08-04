$(document).ready(function() {
	$('#workout').change(function() {
		let value = $(this).val();
		$("#workout > option").each(function() {
			if ($(this).val() === value) {
				$(`#${value}`).css("visibility", "visible");
			}
			else {
				$(`#${(this).value}`).css("visibility", "hidden");
			}
		});
	});
});
$(document).ready(function() {
	$('[name="plus"]').click(function() {
		$('#create-container').css("visibility", "visible");
		$('[name="exit"]').click(function() {
			$('[name="new-workout"]').val('');
			$('#create-container').css('visibility', 'hidden');
		})
		$('[name="new-workout"]').on('keypress', function(e) {
			let code = e.keyCode || e.which;
			if (code === 13) {
				let name = $('[name="new-workout"]').val();
				if (name) {
					$('[name="custom"]').append($('<option>', {
						value: 1,
						text: name
					}));
				}
				$('[name="new-workout"]').val('');
				$('#create-container').css('visibility', 'hidden');
			}
		});
	});
	$('[name="minus"]').click(function() {
		$('[name="custom"] option:selected').remove();
	});
});