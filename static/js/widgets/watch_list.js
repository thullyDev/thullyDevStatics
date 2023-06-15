const get_watch_list_data = () => {
  const render_watch_list = (list_data, is_user, status_code) => {
    const animes_wrapper = document.getElementById("watch_list_inner_wrapper");
    const watch_list_label_wrapper = document.getElementById(
      "watch_list_label_wrapper"
    );
    let animes_html = "";
    list_data.forEach((item) => {
      if (item.animeTitle == "") return null;
      const anime_html = `
        <div class="anime_wrapper hori_anime_wrapper" data-hover-type="false" data-id="${
          item.animeId
        }" data-slug="${item.animeId}">
        <a href="/watch/${encodeURI(item.animeTitle)}?gga=false">
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
        `
      animes_html += anime_html;
    });
    animes_wrapper.innerHTML = animes_html;
    watch_list_label_wrapper.textContent =
      is_user == true && status_code == 200 ? "Watch list animes" : "Popular animes";
  };
  $.ajax({
    type: "post",
    url: "/get_watch_list_data",
    data: {
      csrfmiddlewaretoken: csrf_token,
    },
    beforeSend: () => {
      //todo: do something here i dont know what do
    },
    success: (res) => {
      const res_data = JSON.parse(res);

      res_data.status_code == 200 || res_data.status_code == 201
        ? render_watch_list(res_data.watch_list_data, res_data.is_user, res_data.status_code)
        : console.log("something went wrong getting watch list data...");
    },
  });
};

get_watch_list_data();
