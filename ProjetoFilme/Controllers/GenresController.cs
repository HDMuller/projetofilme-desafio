using ProjetoFilme.Data;
using ProjetoFilme.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace ProjetoFilme.Controllers
{
    public class GenresController : ApiController
    {
        // Instancia um contexto para acessar ao banco de dados
        DataDbContext dataDbContext = new DataDbContext();

        // GET api/genres?ativo={bool}
        // Método para pegar todos os gêneros
        public IHttpActionResult Get([FromUri]bool ativo)
        {
            List<Genre> entities;
            if (ativo)
            {
                // Quando passado ativo=true, pega somente os gêneros ativos
                entities = dataDbContext.Genres.Where(q => q.Ativo == true).ToList();
            }
            else
            {
                // Quando passado ativo=false, pega todos os gêneros
                entities = dataDbContext.Genres.ToList();
            }
            // Retorna as entidades
            return Ok(entities);
        }

        // GET api/genres/:id
        // Método para pegar um gênero especifico, por ID
        public IHttpActionResult Get(int id)
        {
            // Pega o gênero pelo ID
            var entity = dataDbContext.Genres.Find(id);
            // Valida se encontrou
            if (entity == null)
            {
                return BadRequest("Nenhuma entidade encontrada com este id");
            }
            // Retorna a entidade
            return Ok(entity);
        }

        // POST api/genres
        // Método para salvar um novo gênero
        public IHttpActionResult Post([FromBody]Genre entity)
        {
            // Seta a Data de Criação para este momento
            entity.DataCriacao = DateTime.Now;
            // Adiciona no banco de dados
            dataDbContext.Genres.Add(entity);
            // Salva as mudanças feitas no banco de dados
            dataDbContext.SaveChanges();
            // Retorna o id da entidade recém criada
            return Ok(entity.ID);
        }

        // PUT api/genres/5
        // Método para atualizar um gênero existente, passando o ID a ser atualizado, e o objeto para atualizar
        public IHttpActionResult Put(int id, [FromBody]Genre value)
        {
            // Pega o gênero do banco de dados
            var entity = dataDbContext.Genres.FirstOrDefault(q => q.ID == id);
            // Valida se encontrou
            if (entity == null)
            {
                return BadRequest("Nenhuma entidade encontrada com este id");
            }
            // Atualiza os dados necessários
            entity.Nome = value.Nome;
            entity.Ativo = value.Ativo;
            // Salva as mudanças feitas no banco de dados
            dataDbContext.SaveChanges();
            // Retorna mensagem de gênero atualizado com sucesso
            return Ok("Gênero atualizado com sucesso.");
        }

        // DELETE api/genres/:id
        // Método para deletar um gênero
        public IHttpActionResult Delete(int id)
        {
            // Pega a entidade do banco de dados
            var entity = dataDbContext.Genres.Find(id);
            // Valida se encontrou
            if (entity == null)
            {
                return BadRequest("Nenhuma entidade encontrada com este id");
            }
            // Valida se o gênero já foi importado em algum filme
            if (dataDbContext.Films.Count(q => q.GeneroID == entity.ID) > 0)
            {
                // Se foi importado em algum filme, retorna que não foi possível deletar o gênero
                // Isto é para manter a integridade dos dados
                return BadRequest("Não é possível excluir este gênero pois já existe vínculo com filme");
            }
            // Remove do banco de dados
            dataDbContext.Genres.Remove(entity);
            // Salva as mudanças feitas no banco de dados
            dataDbContext.SaveChanges();
            // Retorna que o gênero foi deletado
            return Ok("Gênero deletado.");
        }
    }
}
