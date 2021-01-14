$("#submit").click((e) => {
	if ($("#empty").css("display") == "none") {
		e.preventDefault();

		let eHeight = parseFloat($("#attacks").css("height").slice(0, -2));
		eHeight += 20;
		eHeight += "px";

		$("#attacks").animate(
			{
				height: eHeight,
			},
			500
		);
	}
});

$("#submit").click((e) => {
	e.preventDefault();

	//POST request

	let target_number = $('input[name="target_number"]').val();
	let loops = $('input[name="loops"]').val();
	let button = $('button[type="submit"]').val();

	let user = JSON.stringify({
		target_number: target_number,
		loops: loops,
		button: button,
	});
	let request = new XMLHttpRequest();

	request.open("POST", "/user", true);
	request.setRequestHeader("Content-Type", "application/json");
	request.addEventListener("load", function () {
		let receivedUser = JSON.parse(request.response);
	});

	request.send(user);

	// Other

	let validNum = /^\+(375|7|380)\d{10}/.test(target_number) || /^\+(375)\d{9}/.test(target_number);
	let validLoopz = !isNaN(parseFloat(loops)) && loops !== 0;

	let attacksList = $("#attacksList");

	let attackTime = new Date();
	let h = attackTime.getHours();
	let m = attackTime.getMinutes();
	let s = attackTime.getSeconds();

	if (h < 10) {
		h = "0" + h;
	}
	if (m < 10) {
		m = "0" + m;
	}
	if (s < 10) {
		s = "0" + s;
	}

	if (button == "start" && validNum && validLoopz) {
		var status = "[Started ✔]";

		$('button[type="submit"]').attr("value", "stop").text("Stop Attack").css({
			backgroundImage: "linear-gradient(to right, #25aae1, #4481eb, #04befe, #3f86ed)",
			boxShadow: "0 4px 15px 0 rgba(65, 132, 234, 0.75)",
		});

		if ($("#empty").css("display") !== "none") {
			$("#empty").fadeOut(500);
			setTimeout(() => {
				attacksList.append("<li class='logs'>" + h + ":" + m + ":" + s + ": " + target_number + " " + '<span id="succ">' + status + "</span>" + "</li>");
				$(".logs").fadeIn(500);
			}, 498);
		} else {
			attacksList.append("<li class='logs'>" + h + ":" + m + ":" + s + ": " + target_number + " " + '<span id="succ">' + status + "</span>" + "</li>");
			$(".logs").fadeIn(1000);
		}
	} else if (button == "stop" && validNum) {
		var status = "[Stopped]";

		$('button[type="submit"]').attr("value", "start").text("Start Attack").css({
			backgroundImage: "linear-gradient(to right, #fc6076, #ff9a44, #ef9d43, #e75516)",
			boxShadow: "0px 4px 15px #fc686ebf",
		});

		attacksList.append("<li class='logs'>" + h + ":" + m + ":" + s + ": " + target_number + " " + '<span id="stopped">' + status + "</span>" + "</li>");
		$(".logs").fadeIn(1000);
	} else {
		var status = "Error ⚠";

		$('button[type="submit"]').attr("value", "start");

		if ($("#empty").css("display") !== "none") {
			$("#empty").fadeOut(500);
			setTimeout(() => {
				attacksList.append("<li class='logs'>" + h + ":" + m + ":" + s + ": " + '<span id="err">' + status + "</span>" + "</li>");
				$(".logs").fadeIn(500);
			}, 498);
		} else {
			attacksList.append("<li class='logs'>" + h + ":" + m + ":" + s + ": " + '<span id="err">' + status + "</span>" + "</li>");
			$(".logs").fadeIn(1000);
		}
	}
});

$("#clear").on("click", (e) => {
	e.preventDefault();

	$("li").fadeOut(500);
	setTimeout(() => {
		$("li").remove();
	}, 500);

	setTimeout(() => {
		$("ul").append('<li id="empty">Empty :|</li>');
		$("#empty").fadeIn(500);
	}, 500);

	$("#attacks").animate(
		{
			height: "40px",
		},
		500
	);
});

function maskPhone() {
	var country = $("#country option:selected").val();
	switch (country) {
		case "ru":
			$("#phone").inputmask({ showMaskOnHover: false, alias: "+79999999999", clearIncomplete: true, placeholder: " " });
			break;
		case "ua":
			$("#phone").inputmask({ showMaskOnHover: false, alias: "+3809999999999", clearIncomplete: true, placeholder: " " });
			break;
		case "by":
			$("#phone").inputmask({ showMaskOnHover: false, alias: "+3759999999999", clearIncomplete: true, placeholder: " " });
			break;
	}
}

maskPhone();
$("#country").change(() => {
	maskPhone();
});
