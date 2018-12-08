window.onload = function () {
    // Fetch the HTML element
    var body = document.querySelector("body");
    var div = document.getElementById("script");

    // Assign Matter.js aliases to variables for easier usage
    var Engine = Matter.Engine,
        World = Matter.World,
        Body = Matter.Body,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Events = Matter.Events;

    // Create the simulation engine, describe parameters and sets the rendering options
    var engine = Engine.create(div, {
        density: 0.0005,
        frictionAir: 0.06,
        restitution: 0.3,
        friction: 0.06,
        render: {
            options: {
                background: './image/test.png',
                wireframeBackground: '#222',
                showAngleIndicator: true,//角度指示
                isStatic: true,
                wireframes: false,
                width: window.innerWidth * .55,//55%
                height: window.innerWidth * .50,//50% 
                visible: false

            }
        }
    });

    var ball = Bodies.circle(engine.render.options.width / 2, 246, 35, { //x, y, radius
        density: 0.01, //密度
        friction: 0,
        frictionAir: 0,
    });

    var densitySlider = document.getElementById("density");
    var densityLabel = document.getElementById("density_value");
    densityLabel.innerHTML = densitySlider.value / 10;//預設值
    densitySlider.oninput = function () {
        lastDensity = densityLabel.innerHTML;
        densityLabel.innerHTML = this.value / 10;
        ball.density = this.value / 100;//密度調整
        Body.scale(ball, densityLabel.innerHTML / lastDensity,
            densityLabel.innerHTML / lastDensity);//大小調整
    }

    var ballConstraint = Constraint.create({
        pointA: { x: engine.render.options.width / 2, y: 1 },
        bodyB: ball,
        length: 245//7*35
    });


    var lengthSlider = document.getElementById("length");
    var lengthLabel = document.getElementById("length_value");
    lengthLabel.innerHTML = lengthSlider.value / 10;//預設值
    lengthSlider.oninput = function () {
        lengthLabel.innerHTML = this.value / 10;
        ballConstraint.length = this.value * 35;//長度調整
    }

    // Mouse constraint (touching and moving bodies)
    var mouseConstraint = MouseConstraint.create(engine);

    // add all of the bodies to the world
    World.add(engine.world, [ball, ballConstraint, mouseConstraint]);

    // Fire up the 2D engine
    Engine.run(engine);

    var gravitySlider = document.getElementById("gravity");
    var gravityLabel = document.getElementById("gravity_value");
    gravityLabel.innerHTML = gravitySlider.value / 10;//預設值
    gravitySlider.oninput = function () {
        gravityLabel.innerHTML = this.value / 10;
        engine.world.gravity.y = this.value / 10;//重力調整
    }

    var air_resistanceSlider = document.getElementById("air_resistance");
    var air_resistanceLabel = document.getElementById("air_resistance_value");
    air_resistanceLabel.innerHTML = air_resistanceSlider.value / 1000;//預設值
    air_resistanceSlider.oninput = function () {
        air_resistanceLabel.innerHTML = this.value / 1000;
        ball.frictionAir = this.value / 1000;
    }

    var state = {
        length,
        density,
        gravity,
        air_resistance
    }

    function getState() {
        state.length = lengthSlider.value / 10;
        state.density = densitySlider.value / 10;
        state.gravity = gravitySlider.value / 10;
        state.air_resistance = air_resistance.value / 1000;

        // $.ajax({
        //     url: "/restful/state",
        //     type: "POST",
        //     contentType: "application/json",
        //     data: JSON.stringify(state),
        //     success:function(text){
        //         document.getElementById('state').innerText=text;
        //     }
        // })
    }

    function MODE() {
        if ($('#modeSelect').value == "Test") {
            alert("AAA");
            $('#Exercise').class = "nav-link";
        }
    }

    $('#submit-btn').click(function () {
        getState();
        $('#state').html(JSON.stringify(state));
    });

    $('#Try').change(function () {
        getState();
        $('#Practice').html(JSON.stringify(state));
    });

    $('#nav-home-tab').click(function () {
        $('#Try').show();
        $('#nav-home-tab').attr('disabled', false);
        $("#density").attr('disabled', false);
        $("#gravity").attr('disabled', false);
        $("#air_resistance").attr('disabled', false);
        $('#submit-btn').hide();
    });

    $('#nav-profile-tab').click(function () {
        $('#Try').hide();
        $('#Exam').html('警告！測驗只有一次機會，送出後無法修改' + '<button type="button" class="btn btn-success" onclick="StartExam()" style="margin-left: 10px">開始考試</button>');
        $('air_resistance').value = "0";
        $('#submit-btn').show();
    });

};