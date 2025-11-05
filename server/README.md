# Documentação da API - E-commerce

## Endpoints de Cart

### POST /cart/finish
- **Descrição:** Finaliza a compra.
- **Autorização:** Sim
- **Resposta:** {orderId, url}

### POST /cart/mount
- **Descrição:** responsável por montar um carrinho de items recebendo os ids dos produtos.
- **Parâmetros:** 
  - `id` (path) - ID do carrinho.
- **Resposta:** products

### POST /cart
- **Descrição:** Cria um novo carrinho.
- **Body:** 
  - `userId`: ID do usuário
  - `items`: Lista de produtos e quantidades
- **Resposta:** Carrinho criado.


---

## Endpoints de Category

### GET /category
- Retorna todas as categorias.

### GET /category/:id/product
- Retorna todos os produtos de uma categoria específica.

### POST /category
- Cria uma nova categoria.
- Autização ADMIN

### PUT /category/:id
- Atualiza uma categoria existente.
- Autização ADMIN


---

## Endpoints de Order

### GET /order
- Lista todos os pedidos.
- Autorização

### GET /order/:id
- Retorna um pedido específico.
-  Autorização

### POST /order/status
- Atulizar status de pedido para o kafka
- Autorização


---

## Endpoints de Product

### GET /product
- Lista todos os produtos.

### GET /product/:id
- Retorna um produto específico.

### POST /product
- Cria um novo produto.

### PUT /product/:id
- Atualiza um produto.

### DELETE /product/:id
- Deleta um produto.

---

## Endpoints de Section

### GET /section
- Lista todas as seções.

### GET /section/:id
- Retorna uma seção específica.

### POST /section/:id
- Adicionar um produto a seção

### POST /section
- Cria uma nova seção.

### PUT /section/:id
- Atualiza uma seção.


---

## Endpoints de User

### GET /user/profile
- Retorna um usuário específico.
- Autorização

### POST /user/register
- Cria um novo usuário.
- enviando nome, email e senha

### POST /user/login
- Autentica o usuário com email e senha gerando token de acesso

### POST /user/logout
- O usuário se desloga da sua conta

### POST /user/addres
- Cria um endereço para o usuário
- Autorização

### POST /user/addresess
- pega todos os endereços cadastrados do usuário
- Autorização

### POST user/favorite/:productId
- Adiciona um produto como favorito
- Autorização

### GET /user/favorites
- Pega todos os produtos favoritados
- Autorização
