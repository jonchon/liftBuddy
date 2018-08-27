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
let custom_names = [];
$(document).ready(function() {
	$.ajax({											//Adds previous workouts made
		type: 'GET',
		url: 'http://localhost:3000/custom',
		success: function(data) {
			for (i in data) {
				let res = $.parseJSON(data[i]);
				custom_names.push(res.name);
				if (i == data.length - 1) {
					$('[name="custom"]').append($(`<option selected="selected" value=${res.value}>${res.name}</option>`));		//Don't know why I had to do it like this
				}
				else {
					$('[name="custom"]').append($('<option>', {
						value: res.value,
						text: res.name
					}));
				}
				$('#custom-options').append($(`<select id=${res.value} name=${res.value} size=10>`));
			}
			$.ajax({									//Adds previous exercises
				type: 'GET',
				url: 'http://localhost:3000/options',
				success: function(data) {
					let i;
					let j;
					for (i = 0; i < data.length; i++) {
						for (j = 0; j < data[i].length; j++) {
							let res 		= $.parseJSON(data[i][j]);
							let location 	= $(`[name="custom"] :nth-child(${i+1})`).val();		//select location where we add exercise
							$(`#${location}`).append($('<option>', {
								value: res.value,
								text: res.name
							}));
						}
					}
				}
			});
		}
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
			if (code === 13) {															//13 is enter/return key
				let name 		= $('[name="new-workout"]').val();
				let val 		= name.replace(/ /g, '-');								//replace all spaces with - 
				let to_add_ind 	= $('[name="custom"] option:selected').index() + 1;		//index of the location of custom exercise
				$('[name="new-workout"]').val('');
				for (i in custom_names) {
					if (name === custom_names[i]) {
						if (name != "")
							alert(`${name} already exists`);
						return;
					}
				}
				custom_names.push(name);
				if (name) {
					$('[name="custom"]').append($('<option>', {
						value: val,
						text: name
					}));
					let data	= {};										//Adds new custom with blank array in customOptions
					data.name 	= name;
					data.value	= val;
					$.ajax({
						type: 'POST',
						data: JSON.stringify(data),
						contentType: 'application/json',
						url: 'http://localhost:3000/custom'
					});
					$(`select option[value=${val}]`).attr("selected", true);
					$('#custom-options').append($(`<select id=${val} name=${val} size=10>`));
				}
				$('#create-container').css('visibility', 'hidden');
			}
		});
	});
	$('[name="minus"]').click(function() {								//deals with minus
		let remove 	= $('[name="custom"] option:selected');
		let data	= {};
		data.name 	= remove.text();
		data.value 	= remove.val();
		data.index 	= remove.index();									//deleted before added to mongo
		remove.remove();
		$(`#${data.value}`).css('visibility', 'hidden');
		custom_names.splice(remove.index(), 1);
		$.ajax({														//Updates custom and customOptions and deletes corresponding array entries
			type: 'PUT',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: 'http://localhost:3000/custom'
		});
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

$(document).ready(function() {													//Deals with the right and left arrow
	$('[name="left-arrow"]').click(function() {
		let custom 			= $('[name="custom"] option:selected').val();		//selected option from custom workout
		let custom_ind		= $('[name="custom"] option:selected').index();		//index inside of the custom
		let to_remove_ind 	= $(`[name=${custom}] option:selected`).index();	//index inside of custom options
		$(`[name=${custom}] option:selected`).remove();							//selected excercise from selected custom workout
		let data			= {};
		data.ind1			= custom_ind;
		data.ind2			= to_remove_ind;
		$.ajax({
			type: 'PUT',
			url: 'http://localhost:3000/del_options',
			data: JSON.stringify(data),
			contentType: 'application/json'
		});
	});
	$('[name="right-arrow"]').click(function() {
		let type 			= $('[name="workout"] option:selected').val();		//either legs, arms, back, etc.
		let to_add 			= $(`[name=${type}] option:selected`).val();		//specific workout val from ^^
		let to_add_name 	= $(`[name=${type}] option:selected`).text();		//specific workout name from ^^
		let to_add_ind 		= $('[name="custom"] option:selected').index();		//index of the location of custom exercise
		let location 		= $('[name="custom"] option:selected').val();		//select location where we add exercise
		$(`#${location}`).append($('<option>', {
			value: to_add,
			text: to_add_name
		}));
		let data 			= {};
		data.name 			= to_add_name;
		data.value 			= to_add;
		data.index 			= to_add_ind;
		$.ajax({															//adds exercise to customOptions
			type: 'PUT',
			url: 'http://localhost:3000/options',
			data: JSON.stringify(data),
			contentType: 'application/json'
		})
		$(`select option[value=${to_add}]`).attr("selected", true);
	});
});