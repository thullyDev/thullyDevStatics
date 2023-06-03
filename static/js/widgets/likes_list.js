const get_likes_list_data = () => {
  const render_likes_list = (list_data, is_user) => {
	  console.log({list_data})
    const animes_wrapper = document.getElementById("likes_list_inner_wrapper");
    const like_list_label_wrapper = document.getElementById("like_list_label_wrapper");
    let animes_html = "";
    list_data.forEach((item) => {
	  if (item.animeTitle == "") return null
      const anime_html = `
        <div class="anime_wrapper hori_anime_wrapper" data-hover-type="false" data-id="${
          item.animeId
        }" data-slug="${item.animeId}">
        <a href="/watch/${encodeURI(item.animeTitle)}?ep=${item.episode}&gga=true">
            <div class="anime_cover_wrapper">
                <div class="anime_img_details_cover_wrapper">
                    <div class="anime_img_cover_wrapper">
                        <img src="${
                          item.animeImg
                        }" alt="anime_img_cover" class="anime_img_cover">
                    </div>
                    <div class="anime_details_cover_wrapper">
                        <div class="anime_types_wrapper">
                            <p class="anime_title_text">
                              ${item.animeTitle.substring(0, 20)}...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
        `;
      animes_html += anime_html;
    });
    animes_wrapper.innerHTML = animes_html;
	like_list_label_wrapper.textContent = is_user == true ? "Liked animes" : "Top Airing animes"
  };
  $.ajax({
    type: "post",
    url: "/get_likes_list_data",
    data: {
      csrfmiddlewaretoken: csrf_token,
    },
    beforeSend: () => {
      //todo: do something here i dont know what do
    },
    success: (res) => {
      const res_data = JSON.parse(res);
	  console.log(res_data)

      res_data.status_code == 200
        ? render_likes_list(res_data.likes_list_data, res_data.is_user)
        : console.log("something went wrong getting likes list data...");
    },
  });
};

get_likes_list_data();
