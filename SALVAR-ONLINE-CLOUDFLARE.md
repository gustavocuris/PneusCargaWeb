# Como deixar o painel salvando para todos

O site ja usa a rota `/api/site-content` para salvar as alteracoes da area funcionario.
Para isso funcionar online, o Worker precisa ter um KV conectado com este nome exato:

```txt
SITE_CONTENT
```

No Cloudflare:

1. Abra `Workers & Pages`.
2. Entre no projeto `pneuscargaweb`.
3. Va em `Settings` > `Bindings`.
4. Adicione ou confira um `KV namespace`.
5. Em `Variable name`, use exatamente `SITE_CONTENT`.
6. Em `KV namespace`, escolha `intercap-site-content`.
7. Salve e faca um novo deploy.

Para testar depois do deploy, abra:

```txt
https://pneuscargaweb.intercappneus.workers.dev/api/site-content
```

Se aparecer `SITE_CONTENT KV binding missing.`, o binding ainda nao esta conectado no Worker publicado.
