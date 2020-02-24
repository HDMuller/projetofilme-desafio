using ProjetoFilme.Data;
using ProjetoFilme.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace ProjetoFilme.Controllers
{
    public class FilmsController : ApiController
    {
        // Instancia um contexto para acessar ao banco de dados
        DataDbContext dataDbContext = new DataDbContext();

        // GET api/films?ativo={bool}
        // Método para pegar todos os filmes
        public IHttpActionResult Get([FromUri]bool ativo)
        {
            List<Film> entities;
            if (ativo)
            {
                // Quando passado ativo=true, pega somente os filmes ativos
                entities = dataDbContext.Films.Where(q => q.Ativo == true).ToList();
            }
            else
            {
                // Quando passado ativo=false, pega todos os filmes
                entities = dataDbContext.Films.ToList();
            }
            // Retorna as entidades
            return Ok(entities);
        }

        // GET api/films/:id
        // Método para pegar um filme especifico, por ID
        public IHttpActionResult Get(int id)
        {
            // Pega o filme pelo ID
            var entity = dataDbContext.Films.Find(id);
            // Valida se encontrou
            if (entity == null)
            {
                return BadRequest("Nenhuma entidade encontrada com este id");
            }
            // Retorna a entidade
            return Ok(entity);
        }

        // POST api/films
        // Método para salvar um novo filme
        public IHttpActionResult Post([FromBody]Film entity)
        {
            // Seta a Data de Criação para este momento
            entity.DataCriacao = DateTime.Now;
            // Adiciona no banco de dados
            dataDbContext.Films.Add(entity);
            // Salva as mudanças feitas no banco de dados
            dataDbContext.SaveChanges();
            // Retorna o id da entidade recém criada
            return Ok(entity.ID);
        }

        // PUT api/films/5
        // Método para atualizar um filme existente, passando o ID a ser atualizado, e o objeto para atualizar
        public IHttpActionResult Put(int id, [FromBody]Film value)
        {
            // Pega o filme do banco de dados
            var entity = dataDbContext.Films.FirstOrDefault(q => q.ID == id);
            // Valida se encontrou
            if (entity == null)
            {
                return BadRequest("Nenhuma entidade encontrada com este id");
            }
            // Atualiza os dados necessários
            entity.Nome = value.Nome;
            entity.Ativo = value.Ativo;
            entity.GeneroID = value.GeneroID;
            // Salva as mudanças feitas no banco de dados
            dataDbContext.SaveChanges();
            // Retorna mensagem de filme atualizado com sucesso
            return Ok("Filme atualizado com sucesso.");
        }

        // DELETE api/films/:id
        // Método para deletar um filme
        public IHttpActionResult Delete(int id)
        {
            // Pega a entidade do banco de dados
            var entity = dataDbContext.Films.Find(id);
            // Valida se encontrou
            if (entity == null)
            {
                return BadRequest("Nenhuma entidade encontrada com este id");
            }
            // Valida se o filme já foi importado em alguma locação
            if (dataDbContext.Leases.Count(q => q.Filmes.Contains(entity.ID.ToString())) > 0)
            {
                // Se foi importado em alguma locação, retorna que não foi possível deletar o filme
                // Isto é para manter a integridade dos dados
                return BadRequest("Não é possível excluir este filme pois já existe vínculo com locação");
            }
            // Remove do banco de dados
            dataDbContext.Films.Remove(entity);
            // Salva as mudanças feitas no banco de dados
            dataDbContext.SaveChanges();
            // Retorna que o gênero foi deletado
            return Ok("Filme deletado.");
        }
    }
}
