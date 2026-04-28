package com.example.ecommerce.dto.requesy;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ProductJson {

    private String name;
    private List<String> img;

    @JsonProperty("item_info")
    private ItemInfo itemInfo;

    private String description;

    @Data
    public static class ItemInfo {

        @JsonProperty("Item No.")
        private String itemNo;

        @JsonProperty("Scale")
        private String scale;

        @JsonProperty("Marque")
        private String marque;

        @JsonProperty("Status")
        private String status;
    }
}
