$(() => {
  const page_loader_wrapper = $("#page_loader_wrapper");
  const player_loader_wrapper = $("#player_loader_wrapper");
  let next_ready = true
  
  $('#player_iframe_wrapper, .server_btns').click(() => show_popup())
  
  const render_trending = (list_data) => {
	if (related_animes == "False") return null
    const trending_animes_list_wrapper = document.getElementById(
      "trending_animes_list_wrapper"
    );
    let trending_animes_html = "";

    list_data.forEach((item) => {
		if (item.title == "") return null
      const trending_anime_html = `
        <div class="trending_animes_item">
          <a class="trending_anime_link_wrapper" href="/watch/${
            encodeURI(item.title)
          }?gga=false">
            <div class="trending_anime_img_wrapper">
                <img width="100px" src="${item.image_url}" alt="${
        item.title
      }" class="trending_anime_img">
            </div>
            <div class="trending_anime_info_wrapper">
                <div class="trending_anime_name_wrapper">
                ${item.title.substring(0, 20)}
                </div>
                <div class="trending_other_anime_info_wrapper">
                  <div class="trending_anime_rating_wrapper">
                      ${item.rating}
                  </div>
                  <div class="trending_anime_year_wrapper">
                      ${item.year}
                  </div>
                </div>
            </div>
            </a> 
        </div>
  `;
      trending_animes_html += trending_anime_html;
    });

    trending_animes_list_wrapper.innerHTML = `
        ${trending_animes_html}
    `;
  };

  const render_related = (list_data) => {
	if (related_animes == "False") return null
    const related_animes_list_wrapper = document.getElementById(
      "related_animes_list_wrapper"
    );
    let related_animes_html = "";
    let count = 1;

    list_data.forEach((item) => {
		if (item.title == "") return null
      const related_anime_html = `
        <div class="related_animes_item">
          <a class="related_anime_link_wrapper" href="/watch/${
            encodeURI(item.title)
          }?gga=false">
            <div class="related_anime_img_wrapper">
                <img width="100px" src="${item.image_url}" alt="${
        item.title
      }" class="related_anime_img">
            </div>
            <div class="related_anime_info_wrapper">
                <div class="related_anime_name_wrapper">
                ${item.title.substring(0, 15)}...
                </div>
            </div>
            </a> 
        </div>
  `;
      related_animes_html += related_anime_html;
      count++;
    });

    related_animes_list_wrapper.innerHTML = `
        ${related_animes_html}
    `;
  };
  
  const get_anime_episode = function(ep_num, ep_list) {
	  for (let i = 0; i < ep_list.length; i++) {
		  const item = ep_list[i]
		  
		  if (parseInt(item.episodeNum) == parseInt(ep_num)) {
			  return item
		  } 
	  }
	  
	return ep_list[0]
  }


  const render_anime_details = (data, watch_type = "") => {
	if (data.episodesList.length == 0 || data.episodesList.length == null || data.episodesList.length == undefined) window.location.replace("/alert?message=" + encodeURI(data.animeTitle) + "%20hasn%27t%20not%20come%20out%20yet&sub_message=please%20wait%20for%20it%20to%20be%20air");
    let genres_text = ""; 
    const anime_title = data.animeTitle;
	g_anime_title = data.animeTitle;
    episode_list = data.episodesList.reverse();
    let index = episode_num - 1;
    episode = watch_type == "" ? get_anime_episode(index, episode_list) : get_anime_episode(1, episode_list)
	
	console.log({episode_list, index, episode})
    slug = data.slug;
    episode_num = parseInt(episode.episodeNum);

    if (episode_notice == "True") {
		document.getElementById("episode_text").textContent = `episode ${episode_num}`;
	}

    if (watch_type != "") {
      document.getElementById("anime_type_btn").textContent = watch_type;
      anime_type = watch_type;
    }

    for (let i = 0; i < data.genres.length; i++) {
      const genre = data.genres[i];
      if (i == 0) genres_text += `${genre}`;
      else genres_text += `, ${genre}`;
    }

    const chunk_size = 100;
    let count = 1;
    let open_btn_html = "";
    let eps_column_html = "";
    let open_btns_html = "";

    for (let i = 0; i <= episode_list.length; i += chunk_size) {
      const chunk = episode_list.slice(i, i + chunk_size);

      const chunk_id =
        episode_list.length <= 100
          ? `${count}_${episode_list.length}`
          : `${count}_${count + chunk.length}`;

      if (count == 1)
        open_btn_html = `<button id="anime_eps_open_btn">${chunk_id.replace(
          "_",
          " - "
        )}</button>`;

      open_btns_html += `
        <div class="anime_eps_btn_wrapper">
          <button data-column="${chunk_id}" class="anime_eps_btn">
            ${chunk_id.replace("_", " - ")}
          </button>
        </div>
      `;

      let eps_btns_html = "";
      chunk.forEach((item) => {
        eps_btns_html += `<button data-episode-slug="${item.episodeId}" data-episode="${item.episodeNum}" id="${item.episodeNum}" class="anime_ep_btn" data-type="episode" type="button">${item.episodeNum}</button>`;
      });

      eps_column_html +=
        count == 1
          ? `<div id="${chunk_id}" class="eps_column_wrapper scroll_wrapper active_eps_column_wrapper">${eps_btns_html}</div>`
          : `<div id="${chunk_id}" class="eps_column_wrapper scroll_wrapper">${eps_btns_html}</div>`;

      if (count == 1) current_column = chunk_id;
      count += chunk_size;
    }

    let anime_info_html = `
      <div class="anime_name_info_wrapper">
        ${data.animeTitle.substring(0, 30)}...
      </div>
      <div class="anime_synopsis_info_wrapper">
        <p id="synopsis_text" data-open="false">
          ${data.synopsis}
        </p>
        <span id="more_synopsis">
            more
        </span>
      </div>
`;
    let anime_other_info_html = `        
      <div class="other_info_wrapper">
          <p class="other_info_label">
            Other names:
          </p>
          <p class="other_info_value">
            ${data.otherNames.substring(0, 20)}...
          </p>
        </div>
        <div class="other_info_wrapper">
          <p class="other_info_label">
            Realease date:
          </p>
          <p class="other_info_value">
              ${data.releasedDate}
          </p>
        </div>
        <div class="other_info_wrapper">
          <p class="other_info_label">
            Status:
          </p>
          <p class="other_info_value">
            ${data.status}
          </p>
        </div>
        <div class="other_info_wrapper">
          <p class="other_info_label">
            Episodes:
          </p>
          <p class="other_info_value">
            ${data.totalEpisodes}
          </p>
        </div>
        <div class="other_info_wrapper">
          <p class="other_info_label">
            Type:
          </p>
          <p class="other_info_value">
            ${data.type}
          </p>
        </div>
        <div class="other_info_wrapper">
          <p class="other_info_label">
            Genres:
          </p>
          <p class="other_info_value genre_info_value">
            ${genres_text.substring(0, 20)}...
          </p>
        </div>
`;

    document.getElementById("anime_details_wrapper").innerHTML =
      anime_info_html;
    document.getElementById("dk_anime_other_info_wrapper").innerHTML =
      anime_other_info_html;
    document.getElementById("mb_anime_other_info_wrapper").innerHTML =
      anime_other_info_html;

    document.getElementById(
      "anime_image_cover_wrapper"
    ).innerHTML = `<img src="${data.animeImg}" alt="cover image of ${data.animeTitle}" id="anime_image_cover">`;
    document.getElementById("anime_eps_label_btns_wrapper").innerHTML =
      open_btn_html;
    document.getElementById("anime_eps_btns_wrapper").innerHTML =
      open_btns_html.replace("undefined", "");
    document.getElementById("anime_episodes_btns_wrapper").innerHTML =
      eps_column_html;

    $("#more_synopsis").click(function () {
      const synopsis_text = $("#synopsis_text");
      const anime_synopsis_info_wrapper = $(".anime_synopsis_info_wrapper");
      const data_open = synopsis_text.data("open");

      const open_more_synopsis = () => {
        synopsis_text.data("open", true);
        $(this).text("less");
        synopsis_text.css({
          overflow: "visible",
          "white-space": "normal",
          "text-overflow": "clip",
        });
        anime_synopsis_info_wrapper.css("display", "block");
      };
      const close_more_synopsis = () => {
        synopsis_text.data("open", false);
        $(this).text("more");
        synopsis_text.css({
          overflow: "hidden",
          "white-space": "nowrap",
          "text-overflow": "ellipsis",
        });
        anime_synopsis_info_wrapper.css("display", "flex");
      };

      data_open != true ? open_more_synopsis() : close_more_synopsis();
    });

    $(".next_prev_btn").click(async function () {
	  if (next_ready == false) return null
      const this_ele = $(this);
      const type = this_ele.data("type");
      let pre_index = episode_num;
	  next_ready = false
	  show_popup()

      if (type == "previous") {
        if (episode_num != 1) pre_index = episode_num - 1;
      } else {
        if (episode_list.length > episode_num) pre_index = episode_num + 1;
      }

      if (pre_index != episode_num) {
        episode = get_anime_episode(pre_index, episode_list)
        const slug = episode.episodeId;
        let source = "";
        player_loader_wrapper.css("display", "flex");

        switch (server_num) {
          case 0:
            source = `/stream/0/${slug}?anime_slug=${anime_slug}`;
            break;
          case 1:
            source = `/stream/1/${slug}`;
            break;
          case 2:
            source = `/stream/2/${slug}`;
            break;
          case 3:
            source = `https://kissanime.link/gogo.php?id=${slug}`;
            break;
          case 4:
            source = `https://vidplex.biz/player/${slug}`;
            break;
          case 5:
            source = `https://player.anikatsu.me/?id=${slug}`;
            break;
          default:
            source = `https://player.anikatsu.me/?id=${slug}`;
        }

        document.getElementById("player_iframe_wrapper").innerHTML = ` 
        <iframe
            src="${source}"
            scrolling="no"
            frameborder="0"
            id="player_iframe"
            allowfullscreen
            sandbox="allow-same-origin allow-scripts"
          ></iframe>`;

        player_loader_wrapper.css("display", "none");
        episode_num = parseInt(episode.episodeNum);
        document.getElementById(
          "episode_text"
        ).textContent = `episode ${episode_num}`;

        $(".anime_ep_btn").removeClass("active_ele");
        $(`.anime_ep_btn[data-episode="${episode_num}"]`).addClass(
          "active_ele"
        );
      } else console.log("already got that for you buddy...");
	  
	  setTimeout(function () {
		  next_ready = true
	  }, 1000)
    });

    $(".server_btns").click(function () {
      const this_ele = $(this);
      const server_id = this_ele.data("server-id");
      const src = this_ele.data("src");

      if (server_id != server_num) {
        const source = `${src}${episode.episodeId}?anime_slug=${anime_slug}`;
        server_num = server_id;
        document.getElementById("player_iframe_wrapper").innerHTML = ` 
          <iframe
              src="${source}"
              scrolling="no"
              frameborder="0"
              id="player_iframe"
              allowfullscreen
              sandbox="allow-same-origin allow-scripts"
            ></iframe>`;
        $(`.server_btns`).removeClass("active_ele");
        $(`.server_btns[data-server-id="${server_id}"]`).addClass("active_ele");
      } else console.log("already got that buddy ...");
    });

    $("#anime_type_btn").click(function (event) {
      event.stopPropagation();

      const anime_sub_dub_btns_wrapper = $("#anime_sub_dub_btns_wrapper");
      const open = anime_sub_dub_btns_wrapper.data("open");

      open == false
        ? anime_sub_dub_btns_wrapper.fadeIn(() =>
            anime_sub_dub_btns_wrapper.data("open", true)
          )
        : anime_sub_dub_btns_wrapper.fadeOut(() =>
            anime_sub_dub_btns_wrapper.data("open", false)
          );
    });

    $(".anime_ep_btn").click(async function () {
      const this_ele = $(this);
      const episode_slug = this_ele.data("episode-slug");
      const t_episode = parseInt(this_ele.data("episode"));
	  
	  show_popup()

      if (t_episode != episode_num) {
		episode = get_anime_episode(t_episode, episode_list)
        const player_loader_wrapper = $("#player_loader_wrapper");
        player_loader_wrapper.css("display", "flex");
        let source = "";

        switch (server_num) {
          case 0:
            source = `/stream/0/${episode_slug}?anime_slug=${slug}`;
            break;
          case 1:
            source = `/stream/1/${episode_slug}`;
            break;
          case 2:
            source = `/stream/2/${episode_slug}`;
            break;
          case 3:
            source = `https://kissanime.link/gogo.php?id=${episode_slug}`;
            break;
          case 4:
            source = `https://vidplex.biz/player/${episode_slug}`;
            break;
          case 5:
            source = `https://player.anikatsu.me/?id=${episode_slug}`;
            break;
          default:
            source = `https://player.anikatsu.me/?id=${episode_slug}`;
        }

        document.getElementById("player_iframe_wrapper").innerHTML = ` 
          <iframe
              src="${source}"
              scrolling="no"
              frameborder="0"
              id="player_iframe"
              allowfullscreen
              sandbox="allow-same-origin allow-scripts"
            ></iframe>`;

        player_loader_wrapper.css("display", "none");
        $('.active_ele[data-type="episode"]')
          .addClass("inactive_ele")
          .removeClass("active_ele");
        this_ele.addClass("active_ele");
        episode_num = episode;
        document.getElementById(
          "episode_text"
        ).textContent = `episode ${episode_num}`;
      } else console.log("already got that for you buddy...");
    });

    $("#anime_eps_open_btn").click(function (event) {
      event.stopPropagation();

      const anime_eps_btns_wrapper = $("#anime_eps_btns_wrapper");
      const open = anime_eps_btns_wrapper.data("open");

      open == false
        ? anime_eps_btns_wrapper.fadeIn(() =>
            anime_eps_btns_wrapper.data("open", true)
          )
        : anime_eps_btns_wrapper.fadeOut(() =>
            anime_eps_btns_wrapper.data("open", false)
          );
    });

    const show_column = (column_id, ep = null) => {
      $(".eps_column_wrapper").removeClass("active_eps_column_wrapper");
      $(`#${column_id}`).addClass("active_eps_column_wrapper");
      current_column = column_id;
      console.log({ column_id, current_column });
      document.getElementById("anime_eps_open_btn").textContent =
        column_id.replace("_", " - ");

      if (ep != null) {
        console.log({ ep });
        const anime_eps_btn = $(`.anime_ep_btn[data-episode="${ep}"]`);
        const anime_eps_btns = $(`.anime_ep_btn`);

        anime_eps_btns.removeClass("anime_ep_highlight_btn");
        anime_eps_btn.addClass("anime_ep_highlight_btn");
        document.getElementById(`${ep}`).scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });

        setTimeout(
          () => anime_eps_btn.removeClass("anime_ep_highlight_btn"),
          60000
        );
      }
    };

    $(".anime_eps_btn").click(function () {
      const this_ele = $(this);
      const column_id = this_ele.data("column");

      column_id == current_column
        ? console.log("already got that for you buddy...")
        : show_column(column_id);
    });

    $("#anime_eps_nav_inp").on("keyup input", function () {
      const val = $(this).val();
      const eps_column_wrappers =
        document.getElementsByClassName("eps_column_wrapper");

      if (val != "") {
        const int_val = parseInt(val);

        for (let i = 0; i < eps_column_wrappers.length; i++) {
          const column_id = eps_column_wrappers[i].id;
          const small_int = parseInt(column_id.split("_")[0]);
          const large_int = parseInt(column_id.split("_")[1]);

          if (small_int <= int_val && large_int >= int_val)
            show_column(column_id, int_val);
        }
      } else {
        const anime_eps_btns = $(`.anime_ep_btn`);
        anime_eps_btns.removeClass("anime_ep_highlight_btn");
      }
    });

    $(".anime_sub_dub_btn").click(function () {
      const this_ele = $(this);
      const watch_type = this_ele.data("watch-type");
      const loader_episodes_wrapper = $("#load_anime_episodes_wrapper");

      const get_watch_type = () => {
        $.ajax({
          type: "post",
          url: "/get_watch_type",
          data: {
            csrfmiddlewaretoken: csrf_token,
            slug: slug,
            anime_title: g_anime_title,
            watch_type: watch_type,
          },
          beforeSend: () => {
            loader_episodes_wrapper.css("display", "flex");
          },
          success: (res) => {
            const res_data = JSON.parse(res);
            const anime_details = res_data.anime_details;

            if (anime_details.status_code == 200)
              render_anime_details(anime_details.anime_details, watch_type);
            else if (anime_details.status_code == 404)
              show_alert(`This anime doesn't have an ${watch_type} edition`);
            else console.log("something went wrong getting anime data...");

            load_episode();

            loader_episodes_wrapper.css("display", "none");
          },
        });
      };

      watch_type != anime_type
        ? get_watch_type()
        : show_alert(`Already ${watch_type} edition`);
    });

    const get_anime_ratings = async () => {
      const api_url = encodeURI(
        `https://kitsu.io/api/edge/anime?page[limit]=1&filter[text]=${anime_title}`
      );
      const res_data = await fetch(api_url);
      const data = await res_data.json();
      const rating = data.data[0].attributes.averageRating;
      const rating_count = parseInt(rating.charAt(0));
      let count =
        rating_count == 10 || rating_count == 9
          ? 5
          : rating_count == 8 || rating_count == 7
          ? 4
          : rating_count == 6 || rating_count == 5
          ? 3
          : rating_count == 4 || rating_count == 3
          ? 2
          : 1;

      let stars_html = "";
      let dark_stars_html = "";

      for (let i = 0; i <= count + 1; i += 2)
        stars_html += `<img data-star="${i}" src="//thullydev.github.io/as2anime_static/static/images/full_star.svg" width="20px" height="20px" alt="close icon" class="star_icon">`;

      for (let i = 0; i <= 5 - count + 1; i += 2)
        dark_stars_html += `<img data-star="${i}" src="//thullydev.github.io/as2anime_static/static/images/full_star.svg" width="20px" height="20px" alt="close icon" class="dark_star_icon">`;

      const rating_html = `
      <div id="anime_score_wrapper">
          <p id="anime_score">
            ${rating}
          </p>
      </div>
      <div id="anime_star_system">
        ${stars_html}
        ${dark_stars_html}
      </div>
  `;

      document.getElementById("inner_anime_rating_wrapper").innerHTML =
        rating_html;
    };

    const get_next_episode_data = async () => {
      $.ajax({
        type: "post",
        url: "/get_next_episode_data",
        data: {
          csrfmiddlewaretoken: csrf_token,
          anime_title: encodeURI(anime_title),
        },
        success: async (res) => {
          const res_data = JSON.parse(res);
          console.log(res_data);

          if (res_data.status_code) {
            const air_date = res_data.date;
            let countdown_date = new Date(air_date).getTime();

            let x = setInterval(function () {
              let now = new Date().getTime();

              let distance = countdown_date - now;

              let days = Math.floor(distance / (1000 * 60 * 60 * 24));
              let hours = Math.floor(
                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              );
              let minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60)
              );
              let seconds = Math.floor((distance % (1000 * 60)) / 1000);

              let countdown_text =
                days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
              let episode_text_html = `<p>Next episode airing after <span id="episode_date_text">${countdown_text}</span></p>`;

              document.getElementById("next_episode_text_wrapper").innerHTML =
                episode_text_html;

              if (distance < 0) {
                clearInterval(x);
                document.getElementById("next_episode_text_wrapper").innerHTML =
                  "Airing Now";
              }
            }, 1000);
          }
        },
      });
    };

    get_next_episode_data();

    get_anime_ratings();
  };

  const get_anime = (slug) => {
    if (waiting == false) {
      return $.ajax({
        type: "post",
        url: "/get_anime",
        data: {
          csrfmiddlewaretoken: csrf_token,
          slug: slug,
        },
        beforeSend: () => {
          //todo: do something here i dont know what do
          waiting = true;
        },
        success: (res) => {
          const res_data = JSON.parse(res);
          waiting = false;

          if (res_data.status_code == 200) {
            return {
              files: res_data.files,
              anime_id: res_data.anime_id,
            };
          } else {
            console.log("something went wrong getting anime...");

            return null;
          }
        },
      });
    }
  };

  const get_other_films = async () => {
    const response = await fetch(`/search/${slug}`);
    const response_data = await response.json();
    const data = JSON.parse(response_data);
    let animes_html = "";

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      animes_html += `
        <div class="other_anime_wrapper">
          <a href="/watch/${encodeURI(item.animeTitle)}?gga=false" class="other_anime_link">
            <div class="other_item_image_wrapper">
              <img src="${item.animeImg}" alt="${
        item.animeTitle
      } cover image" class="other_item_image" />
            </div>
            <div class="other_item_details_wrapper">
              <div class="other_name_des_wrapper">
                <p class="other_item_name">${item.animeTitle.substring(
                  0,
                  30
                )}...</p>
              </div>
            </div>
          </a>
        </div>`;
    }

    document.getElementById("inner_other_films_wrapper").innerHTML =
      animes_html;
  };

  const load_episode = async () => {
    const slug = episode.episodeId;
    player_loader_wrapper.css("display", "flex");
    let source = "";

    switch (server_num) {
      case 0:
        source = `/stream/0/${slug}?anime_slug=${anime_slug}`;
        break;
      case 1:
        source = `/stream/1/${slug}`;
        break;
      case 2:
        source = `/stream/2/${slug}`;
        break;
      case 3:
        source = `https://kissanime.link/gogo.php?id=${slug}`;
        break;
      case 4:
        source = `https://vidplex.biz/player/${slug}`;
        break;
      case 5:
        source = `https://player.anikatsu.me/?id=${slug}`;
        break;
      default:
        source = `https://player.anikatsu.me/?id=${slug}`;
    }

    document.getElementById("player_iframe_wrapper").innerHTML = ` 
        <iframe
            src="${source}"
            scrolling="no"
            frameborder="0"
            id="player_iframe"
            allowfullscreen
            sandbox="allow-same-origin allow-scripts"
          ></iframe>`;

    player_loader_wrapper.css("display", "none");

    $(`.server_btns[data-server-id="${server_num}"]`).addClass("active_ele");
    $(`.anime_ep_btn[data-episode="${episode.episodeNum}"]`).addClass(
      "active_ele"
    );
  };

  $.ajax({
    type: "post",
    url: "/get_watch_data",
    data: {
      csrfmiddlewaretoken: csrf_token,
      slug: slug,
    },
    success: async (res) => {
      const res_data = JSON.parse(res);
      const related_data = res_data.related_data;
      const trending_data = res_data.trending_data;
      const anime_details = res_data.anime_details;

      related_data.status_code == 200
        ? render_related(related_data.related_data)
        : console.log("something went wrong getting recent data...");

      trending_data.status_code == 200
        ? render_trending(trending_data.trending_data)
        : console.log("something went wrong getting trending data...");

      anime_details.status_code == 200
        ? render_anime_details(anime_details.anime_details)
        : console.log("something went wrong getting anime data...");

      await get_other_films();
      load_episode();

      page_loader_wrapper.css("display", "none");
	  
	  $(".eps_column_wrapper").each(function(i, obj) {
		  const this_ele = $(this)
		  const col_id = this_ele.attr("id")
		  const ep_num = parseInt(episode_num)
		  const min_num = parseInt($.trim(col_id.split("_")[0]))
		  const max_num = parseInt($.trim(col_id.split("_")[1]))
		  
		  if ( ep_num >= min_num && ep_num <= max_num ) {
			  $(`.anime_eps_btn[data-column="${col_id}"]`).click()
			  
			  setTimeout(function() {
				  document.getElementById(`${ep_num}`).scrollIntoView({
					  behavior: "smooth",
					  block: "nearest",
					  inline: "start",
				  });
			  }, 1000)
		  }
		  
		  
		})
    },
	error: function (jqXHR, textStatus, errorThrown) {
	  if (jqXHR.status == 500) {
		  window.location.replace("/alert?message=The%20anime%20you%20want%20%20is%20not%20out%20yet&sub_message=wait%20for%20the%20anime%20to%20be%20airing");
	  } else {
		  show_alert('Unexpected error.');
	  }
	},
  });
});
