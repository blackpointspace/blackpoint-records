

## Atribuir Role Admin para services@blackpoint.space

O usuario `services@blackpoint.space` (ID: `72961967-9b25-4e8b-bca7-8c64b017cdd8`) foi encontrado no banco de dados com a role atual `artist`.

### Acao necessaria

Executar um UPDATE no banco para alterar a role de `artist` para `admin`:

```sql
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '72961967-9b25-4e8b-bca7-8c64b017cdd8';
```

Isso sera feito usando a ferramenta de modificacao de dados do banco. Apos a alteracao, o usuario sera redirecionado automaticamente para o painel admin (`/admin`) ao fazer login.

### Resultado esperado

- O usuario `services@blackpoint.space` tera acesso completo ao painel administrativo
- Podera gerenciar artistas, aprovar lancamentos, enviar documentos e notificacoes
- As rotas protegidas com `requiredRole="admin"` serao acessiveis

