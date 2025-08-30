console.log("🥟 Samosa PWA loaded!");

const API_URL = "https://script.google.com/macros/s/AKfycbyfDH56eJ2pJ7gGbGrnMIo-TaVWCL4QGS4b7qFgWaTA7Ohjw7yEEsnI0F3fYMoPxdfd/exec";



let USER_EMAIL = "";

// Fetch today's orders
async function loadOrders() {
  console.log("Loading orders from API:", API_URL);

  try {
    const res = await fetch(API_URL);
    console.log("Response object:", res);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("API response JSON:", data);

    USER_EMAIL = data.email || "";
    document.getElementById("emailBox").value = USER_EMAIL;

    const list = document.getElementById("ordersList");
    list.innerHTML = "";

    if (data.result === "success") {
      data.data.forEach(order => {
        console.log("Rendering order:", order);

        const li = document.createElement("li");
        li.textContent = `${order.item} x${order.qtyOrdered} (${order.notes}) - ${order.status}`;

        if (order.supervisor === USER_EMAIL && order.qtyPicked == 0) {
          const btn = document.createElement("button");
          btn.textContent = "❌ Delete";
          btn.onclick = () => deleteOrder(order.rowID);
          li.appendChild(btn);
        }

        list.appendChild(li);
      });
    } else {
      list.innerHTML = `<li>Error: ${data.message}</li>`;
    }
  } catch (err) {
    console.error("🔥 loadOrders failed:", err);
    alert("Failed to load orders. Check console for details.");
  }
}



// Create new order
async function createOrder() {
  const item = document.getElementById("item").value;
  const qtyOrdered = document.getElementById("qtyOrdered").value;
  const notes = document.getElementById("notes").value;

  const payload = {
    action: "create",
    email: USER_EMAIL,
    item,
    qtyOrdered,
    notes
  };

  console.log("Creating order:", payload);

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  alert(result.message || "Order placed!");
  loadOrders();
}

// Delete order
async function deleteOrder(rowID) {
  const payload = {
    action: "delete",
    email: USER_EMAIL,
    rowID
  };

  console.log("Deleting order:", payload);

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const result = await res.json();
  alert(result.message);
  loadOrders();
}

// Load orders on page load
window.onload = loadOrders;

// ✅ Expose functions to HTML buttons
window.createOrder = createOrder;
window.deleteOrder = deleteOrder;
