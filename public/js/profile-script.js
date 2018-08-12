$(document).ready(function() {											//Deals with displaying different select forms from left (set) side
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
$(document).ready(function() {											//Deals with the plus and minus sign on the custom workout section				
	$('[name="plus"]').click(function() {
		$('#create-container').css("visibility", "visible");			//place to write new workout option
		$('[name="exit"]').click(function() {
			$('[name="new-workout"]').val('');							//erases input
			$('#create-container').css('visibility', 'hidden');
		})
		$('[name="new-workout"]').on('keypress', function(e) {
			let code = e.keyCode || e.which;
			if (code === 13) {											//13 is enter/return key
				let name = $('[name="new-workout"]').val();
				let val = name.replace(/ /g, '-');						//replace all spaces with - 
				if (name) {
					$('[name="custom"]').append($('<option>', {
						value: val,
						text: name
					}));
					$(`select option[value=${val}]`).attr("selected", true);
					$('#custom-options').append($(`<select id=${val} name=${val} size=10>`));
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
$(document).ready(function() {											//Deals with displaying different select forms for custom side
	$('#custom').change(function() {									
		let value = $(this).val();
		$("#custom > option").each(function() {	
			if ($(this).val() === value) {
				$(`#${value}`).css("visibility", "visible");
			}
			else {
				$(`#${(this).value}`).css("visibility", "hidden");
			}
		})
	})
})

$(document).ready(function() {											//Deals with the right and left arrow
	$('[name="left-arrow"]').click(function() {
		let to_remove = $('[name="custom"] option:selected').val();		//selected option from custom workout
		$(`[name=${to_remove}] option:selected`).remove();				//selected excercise from selected custom workout
	});
	$('[name="right-arrow"]').click(function() {
		let type = $('[name="workout"] option:selected').val();			//either legs, arms, back, etc.
		let to_add = $(`[name=${type}] option:selected`).val();			//specific workout val from ^^
		let to_add_name = $(`[name=${type}] option:selected`).text();	//specific workout name from ^^
		let location = $('[name="custom"] option:selected').val();		//select location where we add excercise
		$(`#${location}`).append($('<option>', {
			value: to_add,
			text: to_add_name
		}));
		$(`select option[value=${to_add}]`).attr("selected", true);
	});
});