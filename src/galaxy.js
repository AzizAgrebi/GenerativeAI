window.onload = function() {
    var canvas = document.getElementById("galaxyCanvas");
    var ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Define center of the galaxy
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    // Generate stars in a circular pattern
    var numStars = 500;
    var stars = generateGalaxy(centerX, centerY, numStars);

    // Store initial positions of stars
    var initialPositions = stars.map(function(star) {
        return { x: star.x, y: star.y };
    });

    // Boolean flag to track update function
    var useUpdate1 = true;

    // Add event listener for mouse down (left click)
    canvas.addEventListener("mousedown", function(event) {
        if (event.button === 0) { // Check if left mouse button is clicked
            useUpdate1 = !useUpdate1; // Toggle between update functions
            if (!useUpdate1) {
                setTimeout(function() {
                    useUpdate1 = true; // Revert back to update_1 after 5 seconds
                }, 5000);
            }
        }
    });

    // Add event listener for mouse movement
    canvas.addEventListener("mousemove", function(event) {
        handleMouseMove(event);
    });

    // Function to handle mouse movement
    function handleMouseMove(event) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        for (var i = 0; i < stars.length; i++) {
            var star = stars[i];
            var dx = mouseX - star.x;
            var dy = mouseY - star.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            // Apply force to the particle based on the distance from the cursor
            var force = 10000 / (distance * distance);
            star.vx += force * dx / distance;
            star.vy += force * dy / distance;
        }
    }

    // Update star positions and rotate the galaxy (update_1)
    function update_1() {
        var rotationSpeed = 0.001; // Adjust rotation speed as needed
        for (var i = 0; i < stars.length; i++) {
            var star = stars[i];
            var x = star.x - centerX;
            var y = star.y - centerY;
            // Rotate positions around the center of the galaxy
            var newX = x * Math.cos(rotationSpeed) - y * Math.sin(rotationSpeed) + centerX;
            var newY = x * Math.sin(rotationSpeed) + y * Math.cos(rotationSpeed) + centerY;
            star.x = newX;
            star.y = newY;

            // Apply velocity to simulate interaction with the cursor
            star.x += star.vx;
            star.y += star.vy;

            // Dampen velocity to prevent particles from flying off
            star.vx *= 0.9;
            star.vy *= 0.9;
        }
    }

    // Update star positions and rotate the galaxy (update_2)
    function update_2() {
        var rotationSpeed = -0.001; // Adjust rotation speed as needed
        var convergenceForce = 1.8; // Adjust the force of convergence
        for (var i = 0; i < stars.length; i++) {
            var star = stars[i];
            var x = star.x - initialPositions[i].x;
            var y = star.y - initialPositions[i].y;
            // Rotate positions around the center of the galaxy
            var newX = x * Math.cos(rotationSpeed) - y * Math.sin(rotationSpeed) + initialPositions[i].x;
            var newY = x * Math.sin(rotationSpeed) + y * Math.cos(rotationSpeed) + initialPositions[i].y;
            star.x = newX;
            star.y = newY;

            // Apply convergence force towards the center
            var distanceToCenter = Math.sqrt((x - initialPositions[i].x) * (x - initialPositions[i].x) + (y - initialPositions[i].y) * (y - initialPositions[i].y));
            var forceX = (initialPositions[i].x - star.x) * Math.max(convergenceForce / distanceToCenter, 0.0008);
            var forceY = (initialPositions[i].y - star.y) * Math.max(convergenceForce / distanceToCenter, 0.0008);
            star.vx += forceX;
            star.vy += forceY;

            // Apply velocity to simulate interaction with the cursor
            star.x += star.vx;
            star.y += star.vy;

            // Dampen velocity to prevent particles from flying off
            star.vx *= 0.9;
            star.vy *= 0.9;
        }
    }

    // Draw stars
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < stars.length; i++) {
            var star = stars[i];
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.fill();
        }
    }

    // Animation loop
    function animate() {
        if (useUpdate1) {
            update_1();
        } else {
            update_2();
        }
        draw();
        requestAnimationFrame(animate);
    }

    animate();

    // Function to generate stars in a galaxy shape
    function generateGalaxy(centerX, centerY, numStars) {
        var stars = [];
        for (var i = 0; i < numStars; i++) {
            var angle = Math.random() * Math.PI * 2;
            var radius = Math.sqrt(Math.random()) * (Math.min(centerX, centerY) * 0.8);
            var x = centerX + radius * Math.cos(angle);
            var y = centerY + radius * Math.sin(angle);
            var star = {
                x: x,
                y: y,
                vx: 0, // velocity along x-axis
                vy: 0, // velocity along y-axis
                radius: Math.random() * 3,
                color: "white"
            };
            stars.push(star);
        }
        return stars;
    }
};
