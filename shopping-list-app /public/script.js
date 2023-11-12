document.addEventListener('DOMContentLoaded', function () {
    const listsContainer = document.getElementById('lists');
    const productsContainer = document.getElementById('products');
    const newListForm = document.getElementById('newListForm');
    const newListInput = document.getElementById('newListInput');
    const newProductForm = document.getElementById('newProductForm');
    const newProductInput = document.getElementById('newProductInput');
    const newProductQuantityInput = document.getElementById('newProductQuantityInput');

    function toggleItemsList(itemsList) {
        itemsList.style.display = (itemsList.style.display === 'block') ? 'none' : 'block';
    }

    function createListElement(list) {
        const listItem = document.createElement('li');
        listItem.textContent = `${list.name}`;
        listItem.dataset.id = list.id;

        const itemsList = document.createElement('ul');
        itemsList.classList.add('items-list');

        list.items.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.textContent = `${item.quantity} x ${item.name}`;
            itemsList.appendChild(itemElement);
        });

        listItem.appendChild(itemsList);

        listItem.classList.add('accordion');

        listItem.addEventListener('click', () => {
            toggleItemsList(itemsList);
        });

        const addProductForm = document.createElement('form');
        addProductForm.innerHTML = `
            <label for="newProductInput">Add Product:</label>
            <select id="newProductInput" required>
                <option value="" disabled selected>Select a product</option>
            </select>
            <label for="newProductQuantityInput">Quantity:</label>
            <input type="number" id="newProductQuantityInput" min="1" value="1" required>
            <button type="submit">Add</button>
        `;

        const productSelect = addProductForm.querySelector('#newProductInput');
        const newProductQuantityInput = addProductForm.querySelector('#newProductQuantityInput');

        fetch('http://localhost:3000/products')
            .then(response => response.json())
            .then(products => {
                products.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.name;
                    option.textContent = product.name;
                    productSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching product catalog:', error));

        addProductForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const newProductName = productSelect.value;
            const newProductQuantity = parseInt(newProductQuantityInput.value, 10);

            if (newProductName && !isNaN(newProductQuantity)) {
                const selectedListId = listItem.dataset.id;

                fetch(`http://localhost:3000/shopping-lists/${selectedListId}/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newProductName, quantity: newProductQuantity }),
                })
                    .then(response => response.json())
                    .then(updatedList => {
                        const updatedListItem = createListElement(updatedList);
                        listItem.innerHTML = '';
                        listItem.appendChild(updatedListItem);
                    })
                    .catch(error => console.error('Error adding product to the list:', error));
            }
        });

        const deleteListButton = document.createElement('button');
        deleteListButton.textContent = 'Delete List';
        deleteListButton.addEventListener('click', () => {
            const selectedListId = listItem.dataset.id;

            fetch(`http://localhost:3000/shopping-lists/${selectedListId}`, {
                method: 'DELETE',
            })
                .then(() => {
                    listItem.remove();
                })
                .catch(error => console.error('Error deleting shopping list:', error));
        });

        listItem.appendChild(deleteListButton);
        listItem.appendChild(addProductForm);

        return listItem;
    }

    function createProductElement(product) {
        const productItem = document.createElement('li');
        productItem.textContent = product.name;
        productItem.classList.add('product');

        productItem.addEventListener('click', () => {
            const selectedProduct = { name: product.name, quantity: 1 };
            const selectedList = listsContainer.querySelector('.selected');
            if (selectedList) {
                fetch(`http://localhost:3000/shopping-lists/${selectedList.dataset.id}/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(selectedProduct),
                })
                    .then(response => response.json())
                    .then(updatedList => {
                        const updatedListItem = createListElement(updatedList);
                        listItem.innerHTML = '';
                        listItem.appendChild(updatedListItem);
                    })
                    .catch(error => console.error('Error adding product to the list:', error));
            }
        });

        return productItem;
    }

    newListForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const newListName = newListInput.value;

        if (newListName) {
            fetch('http://localhost:3000/shopping-lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newListName, items: [] }),
            })
                .then(response => response.json())
                .then(newList => {
                    const listItem = createListElement(newList);
                    listsContainer.appendChild(listItem);
                    newListInput.value = '';
                })
                .catch(error => console.error('Error creating a new list:', error));
        }
    });

    fetch('http://localhost:3000/shopping-lists')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(list => list.name !== 'Groceries' && list.name !== 'Electronics');
            filteredData.forEach(list => {
                const listItem = createListElement(list);
                listsContainer.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching shopping lists:', error));

    fetch('http://localhost:3000/products')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productItem = createProductElement(product);
                productsContainer.appendChild(productItem);
            });
        })
        .catch(error => console.error('Error fetching product catalog:', error));
});
